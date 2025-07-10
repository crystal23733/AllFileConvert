package test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"feedback/controller"
	"feedback/model"
	"feedback/service"
	"feedback/util"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
	_ = godotenv.Load("../.env") // 환경변수 로드
}

func TestFeedbackEndpoint(t *testing.T) {
	// 테스트용 환경변수 설정
	os.Setenv("FEEDBACK_EMAIL", "test@example.com")
	os.Setenv("SMTP_HOST", "") // SMTP 비활성화

	emailService := service.NewEmailService()
	rateLimiter := util.NewRateLimiter()
	feedbackHandler := controller.NewFeedbackHandler(emailService, rateLimiter)

	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/feedback", feedbackHandler.HandleFeedback)

	// 유효한 피드백 요청 테스트
	feedback := model.FeedbackRequest{
		Type:    "bug",
		Message: "테스트 피드백 메시지입니다. 최소 10자 이상 작성해야 합니다.",
		Email:   "test@example.com",
	}

	jsonData, _ := json.Marshal(feedback)
	req := httptest.NewRequest(http.MethodPost, "/feedback", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()

	r.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("응답 코드 오류: 기대값 %d, 실제값 %d, 응답: %s",
			http.StatusOK, rec.Code, rec.Body.String())
	}

	var response model.FeedbackResponse
	if err := json.Unmarshal(rec.Body.Bytes(), &response); err != nil {
		t.Fatalf("응답 파싱 실패: %v", err)
	}

	if !response.Success {
		t.Fatalf("피드백 처리 실패: %s", response.Message)
	}
}

func TestFeedbackValidation(t *testing.T) {
	emailService := service.NewEmailService()
	rateLimiter := util.NewRateLimiter()
	feedbackHandler := controller.NewFeedbackHandler(emailService, rateLimiter)

	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/feedback", feedbackHandler.HandleFeedback)

	// 잘못된 피드백 타입 테스트
	feedback := model.FeedbackRequest{
		Type:    "invalid",
		Message: "테스트 메시지입니다.",
	}

	jsonData, _ := json.Marshal(feedback)
	req := httptest.NewRequest(http.MethodPost, "/feedback", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()

	r.ServeHTTP(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("검증 실패: 기대값 %d, 실제값 %d", http.StatusBadRequest, rec.Code)
	}
}

package test

import (
	"bytes"
	"download/controller"
	"download/model"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB() *gorm.DB {
	db, _ := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	db.AutoMigrate(&model.Conversion{})
	return db
}

func TestDownloadHandler_Success(t *testing.T) {
	db := setupTestDB()
	gin.SetMode(gin.TestMode)

	// 가짜 파일 생성
	os.MkdirAll("converted", 0755)
	testFile := "converted/test123.mp4"
	os.WriteFile(testFile, []byte("dummy video content"), 0644)
	defer os.Remove(testFile)
	defer os.RemoveAll("converted")

	testToken := "test-download-token-123"
	conv := model.Conversion{
		ID:            "test123",
		FileID:        "file123",
		Status:        "completed",
		DownloadURL:   "/download/test123",
		DownloadToken: testToken,
		DownloadCount: 0,
		TargetFormat:  "mp4",
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
		DeleteAfter:   time.Now().Add(30 * time.Minute),
	}
	db.Create(&conv)

	r := gin.Default()
	r.POST("/download/:id", controller.DownloadHandler(db)) // POST로 변경

	// POST 요청 body에 토큰 포함
	requestBody := map[string]string{"token": testToken}
	jsonBody, _ := json.Marshal(requestBody)

	req := httptest.NewRequest("POST", "/download/test123", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("예상 상태 코드 200, 실제 %d, 응답: %s", w.Code, w.Body.String())
	}

	// DB에서 업데이트된 정보 확인
	var updatedConv model.Conversion
	if err := db.First(&updatedConv, "id = ?", "test123").Error; err != nil {
		t.Fatalf("DB 조회 실패: %v", err)
	}

	if updatedConv.DownloadCount != 1 {
		t.Errorf("DownloadCount 증가 실패: 기대값 1, 실제값 %d", updatedConv.DownloadCount)
	}

	// 토큰이 무효화되었는지 확인 (일회용)
	if updatedConv.DownloadToken != "" {
		t.Errorf("토큰이 무효화되지 않음: %s", updatedConv.DownloadToken)
	}
}

func TestDownloadHandler_InvalidToken(t *testing.T) {
	db := setupTestDB()
	gin.SetMode(gin.TestMode)

	conv := model.Conversion{
		ID:            "test456",
		Status:        "completed",
		DownloadToken: "valid-token",
		TargetFormat:  "pdf",
	}
	db.Create(&conv)

	r := gin.Default()
	r.POST("/download/:id", controller.DownloadHandler(db))

	// 잘못된 토큰으로 요청
	requestBody := map[string]string{"token": "invalid-token"}
	jsonBody, _ := json.Marshal(requestBody)

	req := httptest.NewRequest("POST", "/download/test456", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusForbidden {
		t.Fatalf("예상 상태 코드 403, 실제 %d", w.Code)
	}
}

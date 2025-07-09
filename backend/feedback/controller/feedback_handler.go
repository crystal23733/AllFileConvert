package controller

import (
	"feedback/model"
	"feedback/service"
	"feedback/util"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
)

// FeedbackHandler는 피드백 관련 API를 처리합니다.
type FeedbackHandler struct {
	emailService *service.EmailService
	rateLimiter  *util.RateLimiter
}

// NewFeedbackHandler는 새로운 피드백 핸들러를 생성합니다.
func NewFeedbackHandler(emailService *service.EmailService, rateLimiter *util.RateLimiter) *FeedbackHandler {
	return &FeedbackHandler{
		emailService: emailService,
		rateLimiter:  rateLimiter,
	}
}

// HandleFeedback은 POST /feedback 요청을 처리합니다.
func (h *FeedbackHandler) HandleFeedback(c *gin.Context) {
	clientIP := c.ClientIP()
	trackingID := uuid.New().String()

	// Rate limiting 체크
	if !h.rateLimiter.Allow(clientIP) {
		log.Warn().
			Str("ip", clientIP).
			Str("tracking_id", trackingID).
			Msg("Rate limit 초과")

		c.JSON(http.StatusTooManyRequests, model.FeedbackResponse{
			Success: false,
			Message: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요. (5분에 3회 제한)",
		})
		return
	}

	// 요청 데이터 파싱 및 검증
	var req model.FeedbackRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Warn().
			Err(err).
			Str("ip", clientIP).
			Str("tracking_id", trackingID).
			Msg("잘못된 요청 형식")

		c.JSON(http.StatusBadRequest, model.FeedbackResponse{
			Success: false,
			Message: "요청 형식이 올바르지 않습니다. type(bug/feature/general), message(10-1000자)가 필요합니다.",
		})
		return
	}

	// 이메일 전송
	err := h.emailService.SendFeedback(req.Type, req.Message, req.Email, clientIP)
	if err != nil {
		log.Error().
			Err(err).
			Str("ip", clientIP).
			Str("type", req.Type).
			Str("tracking_id", trackingID).
			Msg("피드백 처리 실패")

		c.JSON(http.StatusInternalServerError, model.FeedbackResponse{
			Success: false,
			Message: "서버 오류로 피드백 전송에 실패했습니다. 잠시 후 다시 시도해주세요.",
		})
		return
	}

	// 성공 로그 (개인정보 제외)
	log.Info().
		Str("ip", clientIP).
		Str("type", req.Type).
		Str("tracking_id", trackingID).
		Int("message_length", len(req.Message)).
		Bool("has_email", req.Email != "").
		Msg("피드백 처리 성공")

	c.JSON(http.StatusOK, model.FeedbackResponse{
		Success: true,
		Message: "피드백이 성공적으로 전송되었습니다. 소중한 의견 감사합니다!",
		ID:      trackingID,
	})
}

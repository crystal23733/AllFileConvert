package main

import (
	"feedback/config"
	"feedback/controller"
	"feedback/service"
	"feedback/util"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	config.SetupLogger()
	_ = godotenv.Load()

	// 서비스 초기화
	emailService := service.NewEmailService()
	rateLimiter := util.NewRateLimiter()
	feedbackHandler := controller.NewFeedbackHandler(emailService, rateLimiter)

	// Gin 라우터 설정
	router := gin.Default()

	// CORS는 Nginx에서 통합 관리

	// 라우터 등록
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "OK",
			"service": "feedback",
		})
	})

	router.POST("/feedback", feedbackHandler.HandleFeedback)

	// 서버 시작
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Feedback Service 실행: 0.0.0.0:%s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("서버 실행 실패: %v", err)
	}
}

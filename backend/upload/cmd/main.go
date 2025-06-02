package main

import (
	"log"
	"os"
	"upload/config"
	"upload/controller"
	"upload/model"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	config.SetupLogger()
	_ = godotenv.Load()

	// DB 연결 및 마이그레이션
	db := config.ConnectDB()
	if err := db.AutoMigrate(&model.File{}); err != nil {
		log.Fatalf("마이그레이션 실패: %v", err)
	}

	router := gin.Default()
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "OK",
		})
	})
	router.POST("/upload", controller.UploadHandler(db))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Upload Service 실행: 0.0.0.0:%s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("서버 실행 실패: %v", err)
	}
}

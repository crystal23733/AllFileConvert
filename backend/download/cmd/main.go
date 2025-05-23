package main

import (
	"download/config"
	"download/controller"
	"download/cron"
	"download/model"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/rs/zerolog/log"
)

func main() {
	config.SetupLogger()
	_ = godotenv.Load()

	db := config.ConnectDB()
	if err := db.AutoMigrate(&model.Conversion{}); err != nil {
		log.Err(err).Msg("마이그레이션 실패")
	}
	cron.StartCleanupWorker(db)

	router := gin.Default()
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "OK",
		})
	})
	router.GET("/download/:id", controller.DownloadHandler(db))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}

	log.Info().Str("address", "0.0.0.0:"+port).Msg("Convert Service 실행")
	if err := router.Run(":" + port); err != nil {
		log.Fatal().Err(err).Msg("서버 실행 실패")
	}
}

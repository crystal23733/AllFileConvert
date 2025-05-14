package main

import (
	"convert/config"
	"convert/model"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/rs/zerolog/log"
)

func main() {
	_ = godotenv.Load()

	// DB 연결 및 마이그레이션
	db := config.ConnectDB()
	if err := db.AutoMigrate(&model.Conversion{}); err != nil {
		log.Fatal().Err(err).Msg("마이그레이션 실패")
	}

	router := gin.Default()
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "OK",
		})
	})

	router.Run()
}

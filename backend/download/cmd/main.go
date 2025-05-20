package main

import (
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/rs/zerolog/log"
)

func main() {
	_ = godotenv.Load()

	router := gin.Default()
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "OK",
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}

	log.Info().Str("address", "0.0.0.0:"+port).Msg("Convert Service 실행")
	if err := router.Run(":" + port); err != nil {
		log.Fatal().Err(err).Msg("서버 실행 실패")
	}
}

// Package config은 환경변수를 읽어 DB 연결을 제공합니다.
package config

import (
	"os"

	"github.com/joho/godotenv"
	"github.com/rs/zerolog/log"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectDB() *gorm.DB {
	_ = godotenv.Load()

	dsn := os.Getenv("DATABASE_DSN")
	if dsn == "" {
		log.Error().Msg("DATABASE_DSN 환경변수가 정의되지 않았습니다.")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Err(err).Msg("DB 연결 실패")
	}

	return db
}

// Package config은 환경변수를 읽어 DB 연결을 제공합니다.
package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// ConnectDB는 .env(DATABASE_DSN) 값을 읽어 PostgreSQL 연결을 반환합니다.
func ConnectDB() *gorm.DB {
	_ = godotenv.Load()

	dsn := os.Getenv("DATABASE_DSN")
	if dsn == "" {
		log.Fatal("DATABASE_DSN 환경변수가 설정되지 않았습니다.")
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("DB 연결 실패: %v", err)
	}

	return db
}

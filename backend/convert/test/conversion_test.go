package test

import (
	"convert/model"
	"os"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func init() {
	_ = godotenv.Load("../.env")
	// 테스트용 환경변수 설정
	os.Setenv("DB_HOST", "localhost")
	os.Setenv("DB_PORT", "5432")
	os.Setenv("DB_USER", "user")
	os.Setenv("DB_PASSWORD", "password")
	os.Setenv("DB_NAME", "test_convert_db")
}

func TestConversionCRUD(t *testing.T) {
	// 테스트용 인메모리 DB 사용
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("테스트 DB 연결 실패: %v", err)
	}
	_ = db.AutoMigrate(&model.Conversion{})

	id := uuid.New().String()
	fileID := uuid.New().String()

	// 최신 모델 구조에 맞게 수정
	f := model.Conversion{
		ID:            id,
		FileID:        fileID,
		TargetFormat:  "avi", // 확장자 점 제거
		Status:        "pending",
		DownloadURL:   "https://www.example.com",
		DownloadToken: "test-token-123",
		DownloadCount: 0,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
		DeleteAfter:   time.Now().Add(30 * time.Minute), // 30분 후 삭제
	}

	if err := db.Create(&f).Error; err != nil {
		t.Fatalf("생성 실패: %v", err)
	}

	var got model.Conversion
	if err := db.First(&got, "id = ?", id).Error; err != nil {
		t.Fatalf("조회 실패: %v", err)
	}

	// 필드 검증
	if got.TargetFormat != "avi" {
		t.Errorf("TargetFormat 불일치: 기대값 'avi', 실제값 '%s'", got.TargetFormat)
	}
	if got.Status != "pending" {
		t.Errorf("Status 불일치: 기대값 'pending', 실제값 '%s'", got.Status)
	}
	if got.DownloadToken != "test-token-123" {
		t.Errorf("DownloadToken 불일치: 기대값 'test-token-123', 실제값 '%s'", got.DownloadToken)
	}
}

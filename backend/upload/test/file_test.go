package test

import (
	"testing"
	"time"

	"upload/config"
	"upload/model"

	"github.com/google/uuid"
	"github.com/joho/godotenv"
)

func init() {
	_ = godotenv.Load("../.env") // 또는 "../.env.test"
}

func TestFileCRUD(t *testing.T) {
	db := config.ConnectDB()
	_ = db.AutoMigrate(&model.File{})

	id := uuid.New().String()
	f := model.File{ID: id, UserID: id, Filename: "sample.mp4", Size: 12, MimeType: "video/mp4", CreatedAt: time.Now()}

	if err := db.Create(&f).Error; err != nil {
		t.Fatalf("생성 실패: %v", err)
	}

	var got model.File
	if err := db.First(&got, "id = ?", id).Error; err != nil {
		t.Fatalf("조회 실패: %v", err)
	}
}

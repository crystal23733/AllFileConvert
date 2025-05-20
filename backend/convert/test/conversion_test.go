package test

import (
	"convert/config"
	"convert/model"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/joho/godotenv"
)

func init() {
	_ = godotenv.Load("../.env")
}

func TestConversionCRUD(t *testing.T) {
	db := config.ConnectDB()
	_ = db.AutoMigrate(&model.Conversion{})

	id := uuid.New().String()
	f := model.Conversion{ID: id, FileID: id, TargetFormat: ".avi", Status: "pending", DownloadURL: "https://www.example.com", CreatedAt: time.Now(), UpdatedAt: time.Now()}

	if err := db.Create(&f).Error; err != nil {
		t.Fatalf("생성 실패: %v", err)
	}

	var got model.Conversion
	if err := db.First(&got, "id = ?", id).Error; err != nil {
		t.Fatalf("조회 실패: %v", err)
	}
}

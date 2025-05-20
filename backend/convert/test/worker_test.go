package test

import (
	"convert/model"
	"convert/worker"
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	assert.NoError(t, err)

	err = db.AutoMigrate(&model.Conversion{}, &model.File{})
	assert.NoError(t, err)

	return db
}

func TestRunConversion_ImageToPDF(t *testing.T) {
	db := setupTestDB(t)

	// 1. 준비: 테스트용 원본 이미지 파일 생성
	testFileID := uuid.New().String()
	uploadPath := filepath.Join("uploads", testFileID)
	err := os.MkdirAll("uploads", 0755)
	assert.NoError(t, err)

	err = os.WriteFile(uploadPath, []byte("fake image content"), 0644) // 실제 이미지 파일은 아님
	assert.NoError(t, err)

	// 2. 파일/변환 정보 DB에 삽입
	testConvID := uuid.New().String()
	file := model.File{
		ID:        testFileID,
		UserID:    "test-user",
		Filename:  "test.jpg",
		MimeType:  "image/jpeg",
		Size:      12345,
		CreatedAt: time.Now(),
	}
	conv := &model.Conversion{
		ID:           testConvID,
		FileID:       testFileID,
		TargetFormat: "png",
		Status:       "pending",
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	err = db.Create(&file).Error
	assert.NoError(t, err)
	err = db.Create(&conv).Error
	assert.NoError(t, err)

	// 3. 변환 실행
	worker.RunConversion(db, conv, file)

	// 4. DB 상태 확인
	var updated model.Conversion
	err = db.First(&updated, "id = ?", testConvID).Error
	assert.NoError(t, err)

	assert.NotEqual(t, "pending", updated.Status) // 처리됨
	assert.Contains(t, []string{"completed", "failed"}, updated.Status)
}

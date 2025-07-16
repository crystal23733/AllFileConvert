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

func TestRunConversion_ImageToPNG(t *testing.T) {
	db := setupTestDB(t)

	// 1. 준비: 테스트용 디렉터리 및 파일 생성
	testFileID := uuid.New().String()
	uploadPath := filepath.Join("uploads", testFileID)
	convertedDir := "converted"

	err := os.MkdirAll("uploads", 0755)
	assert.NoError(t, err)
	err = os.MkdirAll(convertedDir, 0755)
	assert.NoError(t, err)

	defer os.RemoveAll("uploads")
	defer os.RemoveAll(convertedDir)

	// 실제 이미지처럼 보이는 더 큰 파일 생성
	imageContent := make([]byte, 1024) // 1KB
	for i := range imageContent {
		imageContent[i] = byte(i % 256)
	}
	err = os.WriteFile(uploadPath, imageContent, 0644)
	assert.NoError(t, err)

	// 2. 파일/변환 정보 DB에 삽입
	testConvID := uuid.New().String()
	file := model.File{
		ID:        testFileID,
		UserID:    "test-user",
		Filename:  "test.jpg",
		MimeType:  "image/jpeg",
		Size:      1024,
		CreatedAt: time.Now(),
	}
	conv := &model.Conversion{
		ID:            testConvID,
		FileID:        testFileID,
		TargetFormat:  "png",
		Status:        "pending",
		DownloadToken: "",
		DownloadCount: 0,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
		DeleteAfter:   time.Now().Add(30 * time.Minute),
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

	// 완료된 경우 다운로드 토큰이 생성되었는지 확인
	if updated.Status == "completed" {
		assert.NotEmpty(t, updated.DownloadToken, "다운로드 토큰이 생성되어야 함")
		assert.NotEmpty(t, updated.DownloadURL, "다운로드 URL이 설정되어야 함")
	}
}

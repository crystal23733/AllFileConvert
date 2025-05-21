package test

import (
	"download/cron"
	"download/model"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupCleanupTestDB() *gorm.DB {
	db, _ := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	db.AutoMigrate(&model.Conversion{})
	return db
}

func runCleanupOnce(db *gorm.DB) {
	var targets []model.Conversion
	db.Where("status = ? AND delete_after < ?", "completed", time.Now()).Find(&targets)

	for _, conv := range targets {
		ext := strings.TrimPrefix(filepath.Ext(conv.DownloadURL), ".")
		filePath := filepath.Join("converted", conv.ID+"."+ext)

		if err := os.Remove(filePath); err != nil {
			continue
		}

		db.Model(&conv).Updates(map[string]interface{}{
			"status": "deleted",
		})
	}
}

func TestCleanupWorker_DeletesExpiredFiles(t *testing.T) {
	db := setupCleanupTestDB()

	// 가짜 변환 완료 파일 생성
	os.MkdirAll("converted", 0755)
	fileID := "expired123"
	filePath := filepath.Join("converted", fileID+".mp4")
	_ = os.WriteFile(filePath, []byte("dummy content"), 0644)
	defer os.Remove(filePath)

	// DB 레코드 생성
	expired := model.Conversion{
		ID:           fileID,
		Status:       "completed",
		DownloadURL:  "/download/expired123.mp4",
		TargetFormat: "mp4",
		DeleteAfter:  time.Now().Add(-1 * time.Minute), // 과거 시점
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}
	db.Create(&expired)

	runCleanupOnce(db)

	// 실행
	cron.StartCleanupWorker(db)
	time.Sleep(2 * time.Second) // goroutine 작업 기다림

	// 확인: 파일 삭제됨
	if _, err := os.Stat(filePath); !os.IsNotExist(err) {
		t.Fatalf("파일이 삭제되지 않음: %s", filePath)
	}

	// 확인: DB status = deleted
	var updated model.Conversion
	db.First(&updated, "id = ?", fileID)
	if updated.Status != "deleted" {
		t.Errorf("status 기대값: deleted, 실제값: %s", updated.Status)
	}
}

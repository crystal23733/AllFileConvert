package test

import (
	"download/controller"
	"download/model"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB() *gorm.DB {
	db, _ := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	db.AutoMigrate(&model.Conversion{})
	return db
}

func TestDownloadHandler_Success(t *testing.T) {
	db := setupTestDB()
	gin.SetMode(gin.TestMode)

	// 가짜 파일 생성
	os.MkdirAll("converted", 0755)
	testFile := "converted/test123.mp4"
	os.WriteFile(testFile, []byte("dummy content"), 0644)
	defer os.Remove(testFile)

	conv := model.Conversion{
		ID:           "test123",
		Status:       "completed",
		DownloadURL:  "/download/test123.mp4",
		TargetFormat: "mp4",
	}
	db.Create(&conv)

	r := gin.Default()
	r.GET("/download/:id", controller.DownloadHandler(db))

	req := httptest.NewRequest("GET", "/download/test123", nil)
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("예상 상태 코드 200, 실제 %d", w.Code)
	}

	if db.Find(&conv, "id = ?", "test123").Error != nil || conv.DownloadCount != 1 {
		t.Errorf("DownloadCount가 증가하지 않음")
	}
}

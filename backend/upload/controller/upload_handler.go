package controller

import (
	"net/http"
	"os"
	"path/filepath"
	"time"
	"upload/model"
	"upload/util"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// UploadHandler는 POST /upload 요청을 처리합니다.
func UploadHandler(db *gorm.DB) gin.HandlerFunc {
	uploadDir := os.Getenv("UPLOAD_DIR")
	if uploadDir == "" {
		uploadDir = "uploads"
	}
	_ = os.MkdirAll(uploadDir, 0o755)

	return func(c *gin.Context) {
		fileHeader, err := c.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "파일이 필요합니다"})
			return
		}

		mimetype, err := util.DetectMime(fileHeader)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "MIME 타입 확인 실패"})
			return
		}

		id := uuid.New().String()
		savePath := filepath.Join(uploadDir, id)
		if err := c.SaveUploadedFile(fileHeader, savePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "파일 저장 실패"})
			return
		}

		rec := model.File{
			ID:        id,
			UserID:    id,
			Filename:  fileHeader.Filename,
			Size:      fileHeader.Size,
			MimeType:  mimetype,
			CreatedAt: time.Now(),
		}

		if err := db.Create(&rec).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "DB 저장 실패"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"file_id": id})
	}
}

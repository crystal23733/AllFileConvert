package controller

import (
	"convert/model"
	"convert/worker"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type convertRequest struct {
	FileID       string `json:"file_id" binding:"required"`
	TargetFormat string `json:"target_format" binding:"required"`
}

func ConvertHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req convertRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "file_id와 target_format이 필요합니다"})
			return
		}

		conversionID := uuid.New().String()
		conversion := &model.Conversion{
			ID:           conversionID,
			FileID:       req.FileID,
			TargetFormat: req.TargetFormat,
			Status:       "pending",
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		}

		if err := db.Create(&conversion).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "변환 요청 저장 실패"})
			return
		}

		var file model.File
		if err := db.First(&file, "id = ?", req.FileID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "해당 file_id의 원본 파일을 찾을 수 없습니다"})
			return
		}

		// ✅ 비동기 변환 시작
		go worker.RunConversion(db, conversion, file)

		// 클라이언트에 conversion_id 반환
		c.JSON(http.StatusOK, gin.H{"conversion_id": conversionID})
	}
}

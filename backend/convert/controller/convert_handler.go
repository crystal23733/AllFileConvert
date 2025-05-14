package controller

import (
	"convert/model"
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
	}
}

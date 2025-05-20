package controller

import (
	"convert/model"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ConvertStatusHandler는 GET /convert/status/:id 요청을 처리합니다.
func ConvertStatusHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var conv model.Conversion
		if err := db.First(&conv, "id = ?", id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "해당 변환 작업을 찾을 수 없습니다"})
			return
		}

		// 기본 응답
		resp := gin.H{
			"status": conv.Status,
		}

		// 변환 완료 시 다운로드 링크 포함
		if conv.Status == "completed" {
			resp["download_url"] = conv.DownloadURL
		}

		c.JSON(http.StatusOK, resp)
	}
}

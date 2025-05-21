package controller

import (
	"download/model"
	"download/util"
	"fmt"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// DownloadHandler는 변환이 완료된 파일을 다운로드 할 수 있는 링크를 응답해준다.
func DownloadHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		// 1.DB에서 conversion 조회
		var conv model.Conversion
		if err := db.First(&conv, "id = ?", id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "해당 항목이 없습니다"})
			return
		}

		// 2.상태가 completed인지 확인
		if conv.Status != "completed" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "변환이 완료되지 않았습니다"})
			return
		}

		// 3.파일 경로 추출 (예: "converted/{conversion_id}.{ext}")
		ext := strings.TrimPrefix(filepath.Ext(conv.DownloadURL), ".")
		filePath := fmt.Sprintf("converted/%s.%s", conv.ID, ext)

		// 4. 파일 존재 확인
		if !util.FileExists(filePath) {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "파일이 존재하지 않습니다"})
			return
		}

		// 5.다운로드 수 증가
		db.Model(&conv).Update("download_count", conv.DownloadCount+1)

		// 6.파일 응답
		c.FileAttachment(filePath, fmt.Sprintf("converted.%s", ext))
	}
}

package controller

import (
	"download/model"
	"download/util"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

// DownloadHandler는 변환이 완료된 파일을 다운로드 할 수 있는 링크를 응답해준다.
func DownloadHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		log.Info().Str("conversion_id", id).Msg("📥 다운로드 요청 시작")

		// 1.DB에서 conversion 조회
		var conv model.Conversion
		if err := db.First(&conv, "id = ?", id).Error; err != nil {
			log.Error().Err(err).Str("conversion_id", id).Msg("❌ DB에서 conversion 조회 실패")
			c.JSON(http.StatusNotFound, gin.H{"error": "해당 항목이 없습니다"})
			return
		}
		log.Info().Str("status", conv.Status).Str("target_format", conv.TargetFormat).Msg("✅ DB 조회 성공")

		// 2.상태가 completed인지 확인
		if conv.Status != "completed" {
			log.Warn().Str("status", conv.Status).Msg("❌ 변환이 완료되지 않음")
			c.JSON(http.StatusBadRequest, gin.H{"error": "변환이 완료되지 않았습니다"})
			return
		}

		// 3.DownloadURL이 R2 URL이면 리다이렉트
		if strings.HasPrefix(conv.DownloadURL, "https://") {
			c.Redirect(http.StatusTemporaryRedirect, conv.DownloadURL)
			return
		}

		// 4.로컬 파일 경로 생성 (target_format 사용)
		ext := conv.TargetFormat
		filePath := fmt.Sprintf("converted/%s.%s", conv.ID, ext)
		log.Info().Str("filePath", filePath).Msg("📂 파일 경로 생성")

		// 5. 파일 존재 확인
		if !util.FileExists(filePath) {
			log.Error().Str("filePath", filePath).Msg("❌ 파일이 존재하지 않음")
			c.JSON(http.StatusInternalServerError, gin.H{"error": "파일이 존재하지 않습니다"})
			return
		}
		log.Info().Str("filePath", filePath).Msg("✅ 파일 존재 확인")

		// 6.다운로드 수 증가
		log.Info().Int("download_count", conv.DownloadCount).Msg("📈 다운로드 수 증가 시작")
		if err := db.Model(&conv).Update("download_count", conv.DownloadCount+1).Error; err != nil {
			log.Error().Err(err).Msg("❌ 다운로드 수 업데이트 실패")
		}

		// 7.파일 응답
		filename := fmt.Sprintf("converted.%s", ext)
		log.Info().Str("filename", filename).Str("filePath", filePath).Msg("📤 파일 다운로드 시작")
		c.FileAttachment(filePath, filename)
		log.Info().Msg("✅ 파일 다운로드 완료")
	}
}

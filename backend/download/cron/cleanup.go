package cron

import (
	"download/model"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

// StartCleanupWorker는 변환이 완료된 파일을 1시간 단위로 파일을 삭제하는 명령을 수행합니다.
func StartCleanupWorker(db *gorm.DB) {
	ticker := time.NewTicker(1 * time.Minute)

	go func() {
		for range ticker.C {
			var targets []model.Conversion
			db.Where("status = ? AND delete_after < ?", "completed", time.Now()).Find(&targets)

			for _, conv := range targets {
				ext := strings.TrimPrefix(filepath.Ext(conv.DownloadURL), ".")
				filePath := filepath.Join("converted", conv.ID+"."+ext)

				if err := os.Remove(filePath); err != nil {
					log.Warn().Err(err).Str("file", filePath).Str("id", conv.ID).Msg("파일 삭제 실패")
					continue
				}

				db.Model(&conv).Update("status", "deleted")

				log.Info().Str("file", filePath).Str("id", conv.ID).Msg("파일 삭제 완료")
			}
		}
	}()
}

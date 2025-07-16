package cron

import (
	"context"
	"download/model"
	"os"
	"path/filepath"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
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
				deleted := false
				
				// 1. 로컬 파일 삭제 시도
				localFilePath := filepath.Join("converted", conv.ID+"."+conv.TargetFormat)
				if _, err := os.Stat(localFilePath); err == nil {
					// 파일이 존재하면 삭제
					if err := os.Remove(localFilePath); err != nil {
						log.Warn().Err(err).Str("file", localFilePath).Str("id", conv.ID).Msg("로컬 파일 삭제 실패")
					} else {
						log.Info().Str("file", localFilePath).Str("id", conv.ID).Msg("로컬 파일 삭제 완료")
						deleted = true
					}
				} else {
					log.Info().Str("file", localFilePath).Str("id", conv.ID).Msg("로컬 파일 없음 (이미 R2에만 저장됨)")
				}

				// 2. R2 파일 삭제 시도
				if deleteFromR2(conv.ID, conv.TargetFormat) {
					log.Info().Str("conversion_id", conv.ID).Msg("R2 파일 삭제 완료")
					deleted = true
				}

				// 3. 파일 삭제가 성공했거나 파일이 없으면 DB 상태 업데이트
				if deleted {
					db.Model(&conv).Update("status", "deleted")
					log.Info().Str("id", conv.ID).Msg("변환 파일 정리 완료")
				}
			}
		}
	}()
}

// deleteFromR2는 R2 클라우드에서 파일을 삭제합니다.
func deleteFromR2(conversionId, targetFormat string) bool {
	endpoint := os.Getenv("S3_ENDPOINT")
	accessKey := os.Getenv("S3_ACCESS_KEY")
	secretKey := os.Getenv("S3_SECRET_KEY")
	bucket := os.Getenv("S3_BUCKET")
	useSSL := os.Getenv("S3_USE_SSL") == "true"

	// R2 클라이언트 생성
	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: useSSL,
		Region: "auto",
	})
	if err != nil {
		log.Error().Err(err).Msg("❌ R2 클라이언트 생성 실패 (삭제)")
		return false
	}

	// 객체명 생성
	objectName := conversionId + "." + targetFormat

	// R2에서 파일 삭제
	err = client.RemoveObject(context.Background(), bucket, objectName, minio.RemoveObjectOptions{})
	if err != nil {
		log.Warn().Err(err).Str("objectName", objectName).Msg("R2 파일 삭제 실패 (파일이 없을 수 있음)")
		return false
	}

	return true
}

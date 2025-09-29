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
	// 인덱스 생성 (성능 개선)
	createIndexes(db)

	// 1분에서 5분으로 변경하여 DB 부하 감소
	ticker := time.NewTicker(5 * time.Minute)

	go func() {
		for range ticker.C {
			log.Info().Msg("🧹 정리 작업 시작")

			var targets []model.Conversion
			// 배치 처리로 한 번에 최대 100개만 처리
			result := db.Where("status = ? AND delete_after < ?", "completed", time.Now()).
				Limit(100).
				Find(&targets)

			if result.Error != nil {
				log.Error().Err(result.Error).Msg("❌ 정리 대상 조회 실패")
				continue
			}

			if len(targets) == 0 {
				log.Debug().Msg("정리할 파일 없음")
				continue
			}

			log.Info().Int("count", len(targets)).Msg("정리 대상 파일 발견")

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
					result := db.Model(&conv).Update("status", "deleted")
					if result.Error != nil {
						log.Error().Err(result.Error).Str("id", conv.ID).Msg("❌ DB 상태 업데이트 실패")
					} else {
						log.Info().Str("id", conv.ID).Msg("✅ 변환 파일 정리 완료")
					}
				}
			}

			log.Info().Int("processed", len(targets)).Msg("🧹 정리 작업 완료")
		}
	}()
}

// createIndexes는 성능 향상을 위한 인덱스를 생성합니다.
func createIndexes(db *gorm.DB) {
	// conversions 테이블에 복합 인덱스 생성 (status, delete_after)
	if err := db.Exec("CREATE INDEX IF NOT EXISTS idx_conversions_status_delete_after ON conversions(status, delete_after)").Error; err != nil {
		log.Warn().Err(err).Msg("인덱스 생성 실패 (이미 존재할 수 있음)")
	} else {
		log.Info().Msg("✅ 정리 작업용 인덱스 생성 완료")
	}
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

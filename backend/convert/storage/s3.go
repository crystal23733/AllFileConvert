package storage

import (
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/rs/zerolog/log"
)

// UploadToS3는 S3스토리지에 파일을 업로드합니다.
// 성공적인 다운로드 URL을 반환합니다.
func UploadToS3(localPath, objectName string) (string, error) {
	endpoint := os.Getenv("S3_ENDPOINT")
	accessKey := os.Getenv("S3_ACCESS_KEY")
	secretKey := os.Getenv("S3_SECRET_KEY")
	bucket := os.Getenv("S3_BUCKET")
	useSSL := os.Getenv("S3_USE_SSL") == "true"

	log.Info().
		Str("endpoint", endpoint).
		Str("bucket", bucket).
		Bool("useSSL", useSSL).
		Msg("🔐 R2 연결 정보")

	// CloudFlare R2용 클라이언트 생성 (Region 자동 설정)
	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: useSSL,
		Region: "auto", // CloudFlare R2는 auto region 사용
	})
	if err != nil {
		log.Error().Err(err).Msg("❌ R2 클라이언트 생성 실패")
		return "", err
	}
	log.Info().Msg("✅ R2 클라이언트 생성 완료")

	// 버킷이 존재하는지 확인 (R2는 버킷 생성 권한이 제한적일 수 있음)
	log.Info().Str("bucket", bucket).Msg("🪣 버킷 존재 확인 중...")
	exists, err := client.BucketExists(context.Background(), bucket)
	if err != nil {
		log.Error().Err(err).Str("bucket", bucket).Msg("❌ 버킷 존재 확인 실패")
		return "", err
	}
	log.Info().Bool("exists", exists).Msg("🪣 버킷 존재 여부")

	if !exists {
		log.Error().Str("bucket", bucket).Msg("❌ 버킷이 존재하지 않음 - R2 Console에서 버킷을 먼저 생성하세요")
		return "", fmt.Errorf("bucket %s does not exist", bucket)
	}

	// 파일 업로드 (적절한 Content-Type 설정)
	contentType := "application/octet-stream"
	if objectName[len(objectName)-4:] == ".png" {
		contentType = "image/png"
	} else if objectName[len(objectName)-5:] == ".webp" {
		contentType = "image/webp"
	} else if objectName[len(objectName)-4:] == ".jpg" || objectName[len(objectName)-5:] == ".jpeg" {
		contentType = "image/jpeg"
	}

	log.Info().
		Str("localPath", localPath).
		Str("objectName", objectName).
		Str("contentType", contentType).
		Msg("📤 R2 업로드 시도 중...")

	_, err = client.FPutObject(context.Background(), bucket, objectName, localPath, minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		log.Error().
			Err(err).
			Str("localPath", localPath).
			Str("objectName", objectName).
			Msg("❌ R2 업로드 실패")
		return "", err
	}

	// 보안을 위해 presigned URL 대신 Download API 경로 반환
	// objectName에서 conversion ID 추출 (형식: conversionId.extension)
	conversionId := objectName
	// 마지막 점(.)을 찾아서 확장자 제거 (어떤 길이든 처리 가능)
	if lastDot := strings.LastIndex(objectName, "."); lastDot != -1 {
		conversionId = objectName[:lastDot]
	}

	downloadURL := fmt.Sprintf("/download/%s", conversionId)
	log.Info().Str("downloadURL", downloadURL).Str("objectName", objectName).Msg("✅ R2 업로드 완료 (Download API 경로)")
	return downloadURL, nil
}

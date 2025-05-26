package storage

import (
	"context"
	"fmt"
	"os"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

// UploadToS3는 S3스토리지에 파일을 업로드합니다.
// 성공적인 다운로드 URL을 반환합니다.
func UploadToS3(localPath, objectName string) (string, error) {
	endpoint := os.Getenv("S3_ENDPOINT")
	accessKey := os.Getenv("S3_ACCESS_KEY")
	secretKey := os.Getenv("S3_SECRET_KEY")
	bucket := os.Getenv("S3_BUCKET")
	useSSL := os.Getenv("S3_USE_SSL") == "true"

	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		return "", err
	}

	// 버킷이 존재하는지 확인
	exists, err := client.BucketExists(context.Background(), bucket)
	if err != nil {
		return "", err
	}
	if !exists {
		err := client.MakeBucket(context.Background(), bucket, minio.MakeBucketOptions{})
		if err != nil {
			return "", err
		}
	}

	contentType := "application/octet-stream"
	_, err = client.FPutObject(context.Background(), bucket, objectName, localPath, minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		return "", err
	}

	// 공개 URL(필요한 경우 CDN 엔드포인트로 변경)
	publicURL := fmt.Sprintf("https://%s/%s/%s", endpoint, bucket, objectName)
	return publicURL, nil
}

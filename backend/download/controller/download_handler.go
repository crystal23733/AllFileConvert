package controller

import (
	"context"
	"download/model"
	"download/util"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

// DownloadHandler는 변환이 완료된 파일을 다운로드 할 수 있는 링크를 응답해준다.
func DownloadHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		token := c.Query("token") // 쿼리 파라미터에서 토큰 추출
		log.Info().Str("conversion_id", id).Str("token", token).Msg("📥 다운로드 요청 시작")

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

		// 3.보안 토큰 검증 (빈 토큰이 아닌 경우에만 검증)
		if conv.DownloadToken != "" && token != conv.DownloadToken {
			log.Warn().Str("expected", conv.DownloadToken).Str("received", token).Msg("❌ 다운로드 토큰 불일치")
			c.JSON(http.StatusForbidden, gin.H{"error": "유효하지 않은 다운로드 토큰입니다"})
			return
		}

		// 4.다운로드 수 증가 및 즉시 삭제 예약
		log.Info().Int("download_count", conv.DownloadCount).Msg("📈 다운로드 수 증가 시작")
		updates := map[string]interface{}{
			"download_count": conv.DownloadCount + 1,
		}
		
		// 첫 번째 다운로드 시 즉시 삭제 예약 (5분 후)
		if conv.DownloadCount == 0 {
			updates["delete_after"] = time.Now().Add(5 * time.Minute)
			log.Info().Msg("🗑️ 첫 다운로드 완료 - 5분 후 파일 삭제 예약")
		}
		
		if err := db.Model(&conv).Updates(updates).Error; err != nil {
			log.Error().Err(err).Msg("❌ 다운로드 수 업데이트 실패")
		}

		// 5.파일명 생성
		filename := fmt.Sprintf("converted.%s", conv.TargetFormat)

		// 6.R2에서 다운로드 시도 (새로운 방식)
		if err := downloadFromR2(c, id, conv.TargetFormat, filename); err == nil {
			log.Info().Str("conversion_id", id).Msg("✅ R2에서 파일 다운로드 완료")
			return
		}

		// 7.R2 실패 시 로컬 파일 경로 생성 (target_format 사용)
		ext := conv.TargetFormat
		filePath := fmt.Sprintf("converted/%s.%s", conv.ID, ext)
		log.Info().Str("filePath", filePath).Msg("📂 로컬 파일 경로 생성")

		// 8. 로컬 파일 존재 확인
		if !util.FileExists(filePath) {
			log.Error().Str("filePath", filePath).Msg("❌ 파일이 존재하지 않음")
			c.JSON(http.StatusInternalServerError, gin.H{"error": "파일이 존재하지 않습니다"})
			return
		}
		log.Info().Str("filePath", filePath).Msg("✅ 로컬 파일 존재 확인")

		// 9.로컬 파일 응답 (브라우저 다운로드 강제)
		log.Info().Str("filename", filename).Str("filePath", filePath).Msg("📤 로컬 파일 다운로드 시작")
		c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", filename))
		c.FileAttachment(filePath, filename)
		log.Info().Msg("✅ 로컬 파일 다운로드 완료")
	}
}

// downloadFromR2는 R2 스토리지에서 파일을 스트리밍하여 다운로드합니다.
func downloadFromR2(c *gin.Context, conversionId, targetFormat, filename string) error {
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
		log.Error().Err(err).Msg("❌ R2 클라이언트 생성 실패")
		return err
	}

	// 객체명 생성 (conversionId.extension)
	objectName := fmt.Sprintf("%s.%s", conversionId, targetFormat)
	log.Info().Str("objectName", objectName).Msg("🔍 R2에서 파일 검색 중...")

	// R2에서 객체 가져오기
	object, err := client.GetObject(context.Background(), bucket, objectName, minio.GetObjectOptions{})
	if err != nil {
		log.Error().Err(err).Str("objectName", objectName).Msg("❌ R2에서 객체 가져오기 실패")
		return err
	}
	defer object.Close()

	// 객체 정보 확인
	stat, err := object.Stat()
	if err != nil {
		log.Error().Err(err).Str("objectName", objectName).Msg("❌ R2 객체 정보 조회 실패")
		return err
	}

	// Content-Type 설정
	contentType := "application/octet-stream"
	if strings.HasSuffix(objectName, ".png") {
		contentType = "image/png"
	} else if strings.HasSuffix(objectName, ".webp") {
		contentType = "image/webp"
	} else if strings.HasSuffix(objectName, ".jpg") || strings.HasSuffix(objectName, ".jpeg") {
		contentType = "image/jpeg"
	} else if strings.HasSuffix(objectName, ".mp4") {
		contentType = "video/mp4"
	} else if strings.HasSuffix(objectName, ".pdf") {
		contentType = "application/pdf"
	}

	// 응답 헤더 설정 (브라우저 다운로드 강제)
	c.Header("Content-Type", contentType)
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", filename))
	c.Header("Content-Length", fmt.Sprintf("%d", stat.Size))

	log.Info().
		Str("filename", filename).
		Str("contentType", contentType).
		Int64("size", stat.Size).
		Msg("📤 R2에서 파일 스트리밍 시작")

	// R2에서 클라이언트로 직접 스트리밍
	c.DataFromReader(http.StatusOK, stat.Size, contentType, object, map[string]string{
		"Content-Disposition": fmt.Sprintf("attachment; filename=\"%s\"", filename),
	})

	return nil
}

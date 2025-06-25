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

// DownloadRequest는 다운로드 요청 구조체입니다.
type DownloadRequest struct {
	Token string `json:"token" binding:"required"`
}

// DownloadHandler는 변환이 완료된 파일을 다운로드 할 수 있는 링크를 응답해준다.
func DownloadHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		
		// POST 요청에서 body로 토큰 받기 (보안 강화)
		var req DownloadRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			log.Error().Err(err).Msg("❌ 다운로드 요청 파싱 실패")
			c.JSON(http.StatusBadRequest, gin.H{"error": "유효하지 않은 요청 형식입니다"})
			return
		}
		
		log.Info().Str("conversion_id", id).Msg("📥 다운로드 요청 시작 (토큰 보안 처리)")

		// 1.DB에서 conversion 조회 (트랜잭션 시작)
		tx := db.Begin()
		defer func() {
			if r := recover(); r != nil {
				tx.Rollback()
			}
		}()

		var conv model.Conversion
		if err := tx.First(&conv, "id = ?", id).Error; err != nil {
			tx.Rollback()
			log.Error().Err(err).Str("conversion_id", id).Msg("❌ DB에서 conversion 조회 실패")
			c.JSON(http.StatusNotFound, gin.H{"error": "해당 항목이 없습니다"})
			return
		}
		log.Info().Str("status", conv.Status).Str("target_format", conv.TargetFormat).Msg("✅ DB 조회 성공")

		// 2.상태가 completed인지 확인
		if conv.Status != "completed" {
			tx.Rollback()
			log.Warn().Str("status", conv.Status).Msg("❌ 변환이 완료되지 않음")
			c.JSON(http.StatusBadRequest, gin.H{"error": "변환이 완료되지 않았습니다"})
			return
		}

		// 3.보안 토큰 검증 (일회용 토큰)
		if conv.DownloadToken == "" || req.Token != conv.DownloadToken {
			tx.Rollback()
			log.Warn().Str("conversion_id", id).Msg("❌ 다운로드 토큰 불일치 또는 만료됨")
			c.JSON(http.StatusForbidden, gin.H{"error": "유효하지 않거나 만료된 다운로드 토큰입니다"})
			return
		}

		// 4.토큰 즉시 무효화 (일회용으로 만들기)
		if err := tx.Model(&conv).Update("download_token", "").Error; err != nil {
			tx.Rollback()
			log.Error().Err(err).Msg("❌ 토큰 무효화 실패")
			c.JSON(http.StatusInternalServerError, gin.H{"error": "다운로드 처리 중 오류가 발생했습니다"})
			return
		}
		log.Info().Msg("🔒 일회용 토큰 무효화 완료")

		// 5.다운로드 수 증가
		updates := map[string]interface{}{
			"download_count": conv.DownloadCount + 1,
			"delete_after":   time.Now().Add(1 * time.Minute), // 1분 후 삭제 (즉시 삭제 대비)
		}
		
		if err := tx.Model(&conv).Updates(updates).Error; err != nil {
			tx.Rollback()
			log.Error().Err(err).Msg("❌ 다운로드 수 업데이트 실패")
			c.JSON(http.StatusInternalServerError, gin.H{"error": "다운로드 처리 중 오류가 발생했습니다"})
			return
		}

		// 트랜잭션 커밋
		if err := tx.Commit().Error; err != nil {
			log.Error().Err(err).Msg("❌ 트랜잭션 커밋 실패")
			c.JSON(http.StatusInternalServerError, gin.H{"error": "다운로드 처리 중 오류가 발생했습니다"})
			return
		}

		// 6.파일명 생성
		filename := fmt.Sprintf("converted.%s", conv.TargetFormat)

		// 7.R2에서 다운로드 시도
		if err := downloadFromR2(c, id, conv.TargetFormat, filename); err == nil {
			log.Info().Str("conversion_id", id).Msg("✅ R2에서 파일 다운로드 완료")
			
			// 다운로드 완료 후 즉시 삭제 시도
			go func() {
				time.Sleep(10 * time.Second) // 다운로드 완료 대기
				deleteFileImmediately(db, id, conv.TargetFormat)
			}()
			return
		}

		// 8.R2 실패 시 로컬 파일 경로 생성
		ext := conv.TargetFormat
		filePath := fmt.Sprintf("converted/%s.%s", conv.ID, ext)
		log.Info().Str("filePath", filePath).Msg("📂 로컬 파일 경로 생성")

		// 9. 로컬 파일 존재 확인
		if !util.FileExists(filePath) {
			log.Error().Str("filePath", filePath).Msg("❌ 파일이 존재하지 않음")
			c.JSON(http.StatusInternalServerError, gin.H{"error": "파일이 존재하지 않습니다"})
			return
		}

		// 10.로컬 파일 응답 후 즉시 삭제
		log.Info().Str("filename", filename).Str("filePath", filePath).Msg("📤 로컬 파일 다운로드 시작")
		c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", filename))
		c.FileAttachment(filePath, filename)
		
		// 다운로드 완료 후 즉시 삭제
		go func() {
			time.Sleep(5 * time.Second) // 다운로드 완료 대기
			deleteFileImmediately(db, id, conv.TargetFormat)
		}()
		
		log.Info().Msg("✅ 로컬 파일 다운로드 완료 및 삭제 예약")
	}
}

// deleteFileImmediately는 다운로드 완료 후 즉시 파일을 삭제합니다.
func deleteFileImmediately(db *gorm.DB, conversionId, targetFormat string) {
	log.Info().Str("conversion_id", conversionId).Msg("🗑️ 즉시 파일 삭제 시작")
	
	// 1. 로컬 파일 삭제
	localPath := fmt.Sprintf("converted/%s.%s", conversionId, targetFormat)
	if _, err := os.Stat(localPath); err == nil {
		if err := os.Remove(localPath); err != nil {
			log.Error().Err(err).Str("path", localPath).Msg("❌ 로컬 파일 삭제 실패")
		} else {
			log.Info().Str("path", localPath).Msg("✅ 로컬 파일 삭제 완료")
		}
	}
	
	// 2. R2 파일 삭제
	if deleteFromR2(conversionId, targetFormat) {
		log.Info().Str("conversion_id", conversionId).Msg("✅ R2 파일 삭제 완료")
	}
	
	// 3. DB에서 레코드 삭제
	if err := db.Delete(&model.Conversion{}, "id = ?", conversionId).Error; err != nil {
		log.Error().Err(err).Str("conversion_id", conversionId).Msg("❌ DB 레코드 삭제 실패")
	} else {
		log.Info().Str("conversion_id", conversionId).Msg("✅ DB 레코드 삭제 완료")
	}
}

// deleteFromR2는 R2 스토리지에서 파일을 삭제합니다.
func deleteFromR2(conversionId, targetFormat string) bool {
	endpoint := os.Getenv("S3_ENDPOINT")
	accessKey := os.Getenv("S3_ACCESS_KEY")
	secretKey := os.Getenv("S3_SECRET_KEY")
	bucket := os.Getenv("S3_BUCKET")
	useSSL := os.Getenv("S3_USE_SSL") == "true"

	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: useSSL,
		Region: "auto",
	})
	if err != nil {
		log.Error().Err(err).Msg("❌ R2 클라이언트 생성 실패")
		return false
	}

	objectName := fmt.Sprintf("%s.%s", conversionId, targetFormat)
	err = client.RemoveObject(context.Background(), bucket, objectName, minio.RemoveObjectOptions{})
	if err != nil {
		log.Error().Err(err).Str("object", objectName).Msg("❌ R2 파일 삭제 실패")
		return false
	}
	
	return true
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

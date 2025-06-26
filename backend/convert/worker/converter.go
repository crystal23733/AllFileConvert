package worker

import (
	"convert/model"
	"convert/storage"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

// Transformer는 파일 변환 인터페이스입니다.
type Transformer interface {
	// MIME + target_format이 맞는지 판단합니다.
	Supports(mime string, targetFormat string) bool
	// 실제 외부 명령을 실행합니다.
	Transform(inputPath, outputPath string) error
}

type FFmpegTransformer struct{}

func (f FFmpegTransformer) Supports(mime, target string) bool {
	// 비디오 → 비디오/오디오 변환 지원
	if strings.HasPrefix(mime, "video/") {
		videoFormats := []string{"mp4", "avi", "mov", "webm", "mkv", "wmv", "flv", "m4v", "3gp"}
		audioFormats := []string{"mp3", "wav", "aac", "flac", "ogg", "m4a"}
		return contains(videoFormats, target) || contains(audioFormats, target)
	}
	// 오디오 → 오디오 변환 지원
	if strings.HasPrefix(mime, "audio/") {
		audioFormats := []string{"mp3", "wav", "aac", "flac", "ogg", "m4a"}
		return contains(audioFormats, target)
	}
	return false
}

func (f FFmpegTransformer) Transform(in, out string) error {
	// 출력 파일 확장자에 따라 ffmpeg 옵션 조정
	var cmd *exec.Cmd
	ext := strings.ToLower(filepath.Ext(out)[1:]) // 확장자 추출 (.mp4 → mp4)

	switch ext {
	case "mp3":
		cmd = exec.Command("ffmpeg", "-i", in, "-codec:a", "libmp3lame", "-b:a", "192k", out)
	case "wav":
		cmd = exec.Command("ffmpeg", "-i", in, "-codec:a", "pcm_s16le", out)
	case "aac":
		cmd = exec.Command("ffmpeg", "-i", in, "-codec:a", "aac", "-b:a", "128k", out)
	case "flac":
		cmd = exec.Command("ffmpeg", "-i", in, "-codec:a", "flac", out)
	case "ogg":
		cmd = exec.Command("ffmpeg", "-i", in, "-codec:a", "libvorbis", "-b:a", "192k", out)
	case "m4a":
		cmd = exec.Command("ffmpeg", "-i", in, "-codec:a", "aac", "-b:a", "128k", out)
	case "webm":
		cmd = exec.Command("ffmpeg", "-i", in, "-codec:v", "libvpx-vp9", "-codec:a", "libopus", out)
	case "mkv":
		cmd = exec.Command("ffmpeg", "-i", in, "-codec:v", "libx264", "-codec:a", "aac", out)
	default:
		// 기본 변환 (mp4, avi, mov, wmv, flv, m4v, 3gp)
		cmd = exec.Command("ffmpeg", "-i", in, "-codec:v", "libx264", "-codec:a", "aac", out)
	}

	return cmd.Run()
}

type LibreOfficeTransformer struct{}

func (l LibreOfficeTransformer) Supports(mime, target string) bool {
	// 문서 포맷 지원 확인
	documentMimes := []string{
		"application/pdf",
		"application/msword",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
		"application/vnd.ms-powerpoint",
		"application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
		"application/vnd.ms-excel",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
		"application/vnd.oasis.opendocument.text",                           // odt
		"application/vnd.oasis.opendocument.spreadsheet",                    // ods
		"application/vnd.oasis.opendocument.presentation",                   // odp
		"text/plain",
		"text/rtf",
		"text/csv",
	}

	documentTargets := []string{"pdf", "docx", "doc", "pptx", "ppt", "xlsx", "xls", "txt", "rtf", "odt", "ods", "odp", "csv"}

	return contains(documentMimes, mime) && contains(documentTargets, target)
}

func (l LibreOfficeTransformer) Transform(in, out string) error {
	dir := filepath.Dir(out)
	ext := strings.ToLower(filepath.Ext(out)[1:]) // 확장자 추출

	var format string
	switch ext {
	case "pdf":
		format = "pdf"
	case "docx":
		format = "docx"
	case "doc":
		format = "doc"
	case "pptx":
		format = "pptx"
	case "ppt":
		format = "ppt"
	case "xlsx":
		format = "xlsx"
	case "xls":
		format = "xls"
	case "txt":
		format = "txt"
	case "rtf":
		format = "rtf"
	case "odt":
		format = "odt"
	case "ods":
		format = "ods"
	case "odp":
		format = "odp"
	case "csv":
		format = "csv"
	default:
		format = "pdf" // 기본값
	}

	cmd := exec.Command("libreoffice", "--headless", "--convert-to", format, "--outdir", dir, in)
	return cmd.Run()
}

type ImageMagickTransformer struct{}

func (i ImageMagickTransformer) Supports(mime, target string) bool {
	imageFormats := []string{"jpg", "jpeg", "png", "webp", "bmp", "gif", "svg", "tiff", "ico", "avif"}
	return strings.HasPrefix(mime, "image/") && contains(imageFormats, target)
}

func (i ImageMagickTransformer) Transform(in, out string) error {
	// ImageMagick convert 명령 사용
	cmd := exec.Command("convert", in, out)
	return cmd.Run()
}

// 헬퍼 함수: 슬라이스에서 요소 찾기
func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}

// 파일 변환 실패 시 DB 업데이트
func failConversion(db *gorm.DB, id string) {
	log.Error().Str("conversion_id", id).Msg("❌ 변환 실패 처리")
	db.Model(&model.Conversion{}).Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":     "failed",
			"updated_at": time.Now(),
		})
}

// 파일 변환 검증
func fileExists(path string) bool {
	info, err := os.Stat(path)
	exists := err == nil && !info.IsDir()
	log.Info().Str("path", path).Bool("exists", exists).Msg("📁 파일 존재 확인")
	return exists
}

// generateSecureToken은 보안 다운로드 토큰을 생성합니다.
func generateSecureToken() string {
	bytes := make([]byte, 16)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}

// 고루틴에서 호출, 성공/실패 시 DB를 업데이트하는 함수입니다.
func RunConversion(db *gorm.DB, conv *model.Conversion, file model.File) {
	log.Info().
		Str("conversion_id", conv.ID).
		Str("file_id", file.ID).
		Str("mime", file.MimeType).
		Str("target", conv.TargetFormat).
		Msg("🚀 변환 작업 시작")

	inputPath := filepath.Join("uploads", file.ID)
	outputName := fmt.Sprintf("%s.%s", conv.ID, conv.TargetFormat)
	outputPath := filepath.Join("converted", outputName)

	log.Info().
		Str("input_path", inputPath).
		Str("output_path", outputPath).
		Msg("📂 파일 경로 설정")

	// 1. 입력 파일 존재 확인
	if !fileExists(inputPath) {
		log.Error().Str("path", inputPath).Msg("❌ 입력 파일이 존재하지 않음")
		failConversion(db, conv.ID)
		return
	}

	// 2. 변환 가능한 트랜스포머 선택
	transformers := []Transformer{
		FFmpegTransformer{},
		LibreOfficeTransformer{},
		ImageMagickTransformer{},
	}

	var selected Transformer
	for _, t := range transformers {
		if t.Supports(file.MimeType, conv.TargetFormat) {
			selected = t
			log.Info().
				Str("transformer", fmt.Sprintf("%T", t)).
				Str("mime", file.MimeType).
				Str("target", conv.TargetFormat).
				Msg("🔧 변환기 선택됨")
			break
		}
	}

	if selected == nil {
		log.Error().
			Str("mime", file.MimeType).
			Str("target", conv.TargetFormat).
			Msg("❌ 지원하지 않는 변환 형식")
		failConversion(db, conv.ID)
		return
	}

	// 3. 상태를 processing으로 변경
	log.Info().Msg("🔄 상태를 processing으로 변경")
	result := db.Model(&model.Conversion{}).Where("id = ?", conv.ID).Update("status", "processing")
	if result.Error != nil {
		log.Error().Err(result.Error).Msg("❌ 상태 업데이트 실패")
	}

	// 4. 변환 실행
	log.Info().Msg("🎬 변환 명령 실행 중...")
	err := selected.Transform(inputPath, outputPath)
	if err != nil || !fileExists(outputPath) {
		log.Error().
			Err(err).
			Str("input", inputPath).
			Str("output", outputPath).
			Msg("❌ 변환 명령 실행 실패")
		failConversion(db, conv.ID)
		return
	}

	// 5. 출력 파일 확인
	if !fileExists(outputPath) {
		log.Error().Str("path", outputPath).Msg("❌ 변환된 파일이 생성되지 않음")
		failConversion(db, conv.ID)
		return
	}

	// 6. S3 업로드 시도 (실패 시 로컬 백업)
	log.Info().Str("file", outputPath).Msg("☁️ S3 업로드 시도 중...")

	s3url, err := storage.UploadToS3(outputPath, outputName)
	if err != nil {
		log.Error().
			Err(err).
			Str("file", outputPath).
			Msg("❌ S3 업로드 실패 - 로컬 백업으로 전환")

		// S3 실패 시 로컬 다운로드 URL로 백업
		s3url = fmt.Sprintf("/download/%s", conv.ID)
		log.Info().Str("backupURL", s3url).Msg("🔄 로컬 백업 URL 생성")
	} else {
		log.Info().Str("s3URL", s3url).Msg("✅ S3 업로드 완료")
	}

	// 7. 완료 처리
	log.Info().Str("url", s3url).Msg("✅ S3 업로드 완료")

	// 보안 토큰 생성
	downloadToken := generateSecureToken()

	db.Model(&model.Conversion{}).Where("id = ?", conv.ID).
		Updates(map[string]interface{}{
			"status":         "completed",
			"download_url":   s3url,
			"download_token": downloadToken,
			"updated_at":     time.Now(),
			"delete_after":   time.Now().Add(30 * time.Minute),
		})

	log.Info().Str("conversion_id", conv.ID).Str("download_token", downloadToken).Msg("🎉 변환 작업 완료")
}

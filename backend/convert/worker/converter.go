package worker

import (
	"convert/model"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

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
	return strings.HasPrefix(mime, "video/") && target == "mp4"
}

func (f FFmpegTransformer) Transform(in, out string) error {
	cmd := exec.Command("ffmpeg", "-i", in, out)
	return cmd.Run()
}

type LibreOfficeTransformer struct{}

func (l LibreOfficeTransformer) Supports(mime, target string) bool {
	return strings.HasPrefix(mime, "application/") && target == "pdf"
}

func (l LibreOfficeTransformer) Transform(in, out string) error {
	dir := filepath.Dir(out)
	cmd := exec.Command("libreoffice", "--headless", "--convert-to", "pdf", "--outdir", dir, in)
	return cmd.Run()
}

type ImageMagickTransformer struct{}

func (i ImageMagickTransformer) Supports(mime, target string) bool {
	return strings.HasPrefix(mime, "image/") && target != "mp4"
}

func (i ImageMagickTransformer) Transform(in, out string) error {
	cmd := exec.Command("convert", in, out)
	return cmd.Run()
}

// 파일 변환 실패 시 DB 업데이트
func failConversion(db *gorm.DB, id string) {
	db.Model(&model.Conversion{}).Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":     "failed",
			"updated_at": time.Now(),
		})
}

// 파일 변환 검증
func fileExists(path string) bool {
	info, err := os.Stat(path)
	return err == nil && !info.IsDir()
}

// 고루틴에서 호출, 성공/실패 시 DB를 업데이트하는 함수입니다.
func RunConversion(db *gorm.DB, conv *model.Conversion, file model.File) {
	inputPath := filepath.Join("uploads", file.ID)
	outputName := fmt.Sprintf("%s.%s", conv.ID, conv.TargetFormat)
	outputPath := filepath.Join("converted", outputName)

	transformers := []Transformer{
		FFmpegTransformer{},
		LibreOfficeTransformer{},
		ImageMagickTransformer{},
	}

	var selected Transformer
	for _, t := range transformers {
		if t.Supports(file.MimeType, conv.TargetFormat) {
			selected = t
			break
		}
	}

	if selected == nil {
		failConversion(db, conv.ID)
		return
	}

	db.Model(&model.Conversion{}).Where("id = ?", conv.ID).Update("status", "processing")

	err := selected.Transform(inputPath, outputPath)
	if err != nil || !fileExists(outputPath) {
		failConversion(db, conv.ID)
		return
	}

	downloadURL := fmt.Sprintf("/download/%s", conv.ID) // 추후 S3, CDN 경로로 변경 가능
	db.Model(&model.Conversion{}).Where("id = ?", conv.ID).
		Updates(map[string]interface{}{
			"status":       "completed",
			"download_url": downloadURL,
			"updated_at":   time.Now(),
		})
}

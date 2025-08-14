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
	// MIME 타입에서 charset 등의 파라미터 제거
	baseMime := strings.Split(mime, ";")[0]
	baseMime = strings.TrimSpace(baseMime)

	// 비디오 → 비디오/오디오 변환 지원
	if strings.HasPrefix(baseMime, "video/") {
		videoFormats := []string{"mp4", "avi", "mov", "webm", "mkv", "wmv", "flv", "m4v", "3gp"}
		audioFormats := []string{"mp3", "wav", "aac", "flac", "ogg", "m4a"}
		return contains(videoFormats, target) || contains(audioFormats, target)
	}
	// 오디오 → 오디오 변환 지원
	if strings.HasPrefix(baseMime, "audio/") {
		audioFormats := []string{"mp3", "wav", "aac", "flac", "ogg", "m4a"}
		return contains(audioFormats, target)
	}
	return false
}

func (f FFmpegTransformer) Transform(in, out string) error {
	// 출력 파일 확장자에 따라 ffmpeg 옵션 조정
	var cmd *exec.Cmd
	ext := safeGetExt(out) // 안전한 확장자 추출

	// 기본 FFmpeg 옵션 (덮어쓰기, 로그 레벨)
	baseArgs := []string{"-y", "-loglevel", "error", "-i", in}

	switch ext {
	case "mp3":
		cmd = exec.Command("ffmpeg", append(baseArgs, "-codec:a", "libmp3lame", "-b:a", "192k", "-ar", "44100", out)...)
	case "wav":
		cmd = exec.Command("ffmpeg", append(baseArgs, "-codec:a", "pcm_s16le", "-ar", "44100", out)...)
	case "aac":
		cmd = exec.Command("ffmpeg", append(baseArgs, "-codec:a", "aac", "-b:a", "128k", "-ar", "44100", out)...)
	case "flac":
		cmd = exec.Command("ffmpeg", append(baseArgs, "-codec:a", "flac", "-ar", "44100", out)...)
	case "ogg":
		cmd = exec.Command("ffmpeg", append(baseArgs, "-codec:a", "libvorbis", "-b:a", "192k", "-ar", "44100", out)...)
	case "m4a":
		cmd = exec.Command("ffmpeg", append(baseArgs, "-codec:a", "aac", "-b:a", "128k", "-ar", "44100", out)...)
	case "webm":
		cmd = exec.Command("ffmpeg", append(baseArgs, "-codec:v", "libvpx-vp9", "-codec:a", "libopus", "-b:v", "1M", "-b:a", "128k", out)...)
	case "mkv":
		cmd = exec.Command("ffmpeg", append(baseArgs, "-codec:v", "libx264", "-codec:a", "aac", "-preset", "fast", "-crf", "23", out)...)
	case "avi":
		cmd = exec.Command("ffmpeg", append(baseArgs, "-codec:v", "libx264", "-codec:a", "aac", "-preset", "fast", "-crf", "23", out)...)
	case "mov":
		cmd = exec.Command("ffmpeg", append(baseArgs, "-codec:v", "libx264", "-codec:a", "aac", "-preset", "fast", "-crf", "23", out)...)
	case "wmv":
		cmd = exec.Command("ffmpeg", append(baseArgs, "-codec:v", "wmv2", "-codec:a", "wmav2", "-b:v", "1M", "-b:a", "128k", out)...)
	case "flv":
		cmd = exec.Command("ffmpeg", append(baseArgs, "-codec:v", "libx264", "-codec:a", "aac", "-preset", "fast", "-crf", "23", out)...)
	case "m4v":
		cmd = exec.Command("ffmpeg", append(baseArgs, "-codec:v", "libx264", "-codec:a", "aac", "-preset", "fast", "-crf", "23", out)...)
	case "3gp":
		cmd = exec.Command("ffmpeg", append(baseArgs, "-codec:v", "h263", "-codec:a", "amr_nb", "-s", "176x144", "-r", "15", out)...)
	default:
		// 기본 변환 (mp4)
		cmd = exec.Command("ffmpeg", append(baseArgs, "-codec:v", "libx264", "-codec:a", "aac", "-preset", "fast", "-crf", "23", out)...)
	}

	log.Info().Strs("args", cmd.Args).Msg("🎬 FFmpeg 명령 실행")

	output, err := cmd.CombinedOutput()
	if err != nil {
		log.Error().Err(err).Str("output", string(output)).Msg("❌ FFmpeg 변환 실패")
		return err
	}

	log.Info().Str("output", string(output)).Msg("✅ FFmpeg 변환 완료")
	return nil
}

type LibreOfficeTransformer struct{}

func (l LibreOfficeTransformer) Supports(mime, target string) bool {
	// MIME 타입에서 charset 등의 파라미터 제거
	baseMime := strings.Split(mime, ";")[0]
	baseMime = strings.TrimSpace(baseMime)

	// LibreOffice 변환 매트릭스 (실제 테스트 완료된 변환만 포함)
	supportedConversions := map[string][]string{
		// Writer 문서들 (텍스트 기반) - 실제 작동 확인됨
		"application/msword":        {"pdf", "docx", "odt", "rtf", "txt"},
		"application/x-ole-storage": {"pdf", "docx", "odt", "rtf", "txt"}, // 구버전 DOC 파일
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document": {"pdf", "doc", "odt", "rtf", "txt"},
		"application/vnd.oasis.opendocument.text":                                 {"pdf", "docx", "doc", "rtf", "txt"},
		"text/plain": {"pdf", "docx", "doc", "odt", "rtf"},
		"text/rtf":   {"pdf", "docx", "doc", "odt", "txt"},

		// Calc 스프레드시트들 (PDF 변환 제외 - 실패함)
		"application/vnd.ms-excel": {"xlsx", "ods", "csv", "txt"},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {"xls", "ods", "csv", "txt"},
		"application/vnd.oasis.opendocument.spreadsheet":                    {"xlsx", "xls", "csv", "txt"},
		"text/csv": {"xlsx", "xls", "ods"},

		// Impress 프레젠테이션들 - LibreOffice에서 지원하지 않음 (모든 변환 실패)
		// "application/vnd.ms-powerpoint": {},
		// "application/vnd.openxmlformats-officedocument.presentationml.presentation": {},
		// "application/vnd.oasis.opendocument.presentation": {},

		// PDF는 LibreOffice에서 변환 지원하지 않음 (import만 가능, export filter 없음)
	}

	if supportedTargets, exists := supportedConversions[baseMime]; exists {
		return contains(supportedTargets, target)
	}

	return false
}

func (l LibreOfficeTransformer) Transform(in, out string) error {
	dir := filepath.Dir(out)
	ext := safeGetExt(out) // 안전한 확장자 추출
	inputExt := safeGetExt(in)

	// 절대 경로로 변환
	absIn, err := filepath.Abs(in)
	if err != nil {
		log.Error().Err(err).Str("path", in).Msg("❌ 입력 파일 절대 경로 변환 실패")
		return err
	}

	absDir, err := filepath.Abs(dir)
	if err != nil {
		log.Error().Err(err).Str("path", dir).Msg("❌ 출력 디렉터리 절대 경로 변환 실패")
		return err
	}

	// CSV 파일 확인 (확장자 기반으로만 판단 - 내용 분석 제거)
	isCSV := inputExt == "csv"

	var format string
	var args []string

	// 기본 LibreOffice 인수
	args = append(args, "libreoffice", "--headless", "--invisible", "--nodefault", "--nolockcheck")

	// 입력 파일이 CSV인 경우 특별 처리 (확장자 없는 파일 포함)
	if isCSV {
		switch ext {
		case "xlsx":
			// CSV → XLSX: 입력 필터 지정으로 확장자 없는 파일 처리
			args = append(args, "--infilter=Text - txt - csv (StarCalc)", "--convert-to", "xlsx", "--outdir", absDir, absIn)
		case "xls":
			// CSV → XLS: Excel 97 형식
			args = append(args, "--infilter=Text - txt - csv (StarCalc)", "--convert-to", "xls", "--outdir", absDir, absIn)
		case "ods":
			// CSV → ODS: OpenDocument Spreadsheet
			args = append(args, "--infilter=Text - txt - csv (StarCalc)", "--convert-to", "ods", "--outdir", absDir, absIn)
		case "pdf":
			// CSV → PDF: 직접 변환
			args = append(args, "--infilter=Text - txt - csv (StarCalc)", "--convert-to", "pdf", "--outdir", absDir, absIn)
		default:
			args = append(args, "--infilter=Text - txt - csv (StarCalc)", "--convert-to", ext, "--outdir", absDir, absIn)
		}
	} else {
		// 일반 문서 변환
		switch ext {
		case "pdf":
			// PDF 변환 시 한글 폰트 지원을 위한 안정적인 변환
			args = append(args,
				"--convert-to", "pdf",
				"--outdir", absDir,
				"-env:UserInstallation=file:///tmp/libreoffice",
				absIn)
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

		// PDF가 아닌 경우 기본 변환 명령 사용
		if ext != "pdf" {
			args = append(args, "--convert-to", format, "--outdir", absDir, absIn)
		}
	}

	log.Info().Strs("args", args).Msg("🔧 LibreOffice 명령 실행")
	cmd := exec.Command(args[0], args[1:]...)

	// 환경변수 설정 (LibreOffice가 headless 모드에서 안정적으로 실행되고 한글 폰트를 찾도록)
	cmd.Env = append(os.Environ(),
		"HOME=/tmp",
		"TMPDIR=/tmp",
		"DISPLAY=",
		"LANG=ko_KR.UTF-8",
		"LC_ALL=ko_KR.UTF-8",
		"FONTCONFIG_PATH=/etc/fonts",
	)

	output, err := cmd.CombinedOutput()
	if err != nil {
		log.Error().Err(err).Str("output", string(output)).Msg("❌ LibreOffice 변환 실패")
		return err
	}

	log.Info().Str("output", string(output)).Msg("✅ LibreOffice 변환 완료")

	// LibreOffice는 입력 파일명을 기준으로 출력 파일을 생성하므로 이름 변경 필요
	inputBasename := filepath.Base(absIn)
	inputNameWithoutExt := strings.TrimSuffix(inputBasename, filepath.Ext(inputBasename))
	libreOfficeOutput := filepath.Join(absDir, inputNameWithoutExt+"."+ext)

	// LibreOffice가 생성한 파일이 존재하고, 목표 파일명과 다르면 이름 변경
	if libreOfficeOutput != out && fileExists(libreOfficeOutput) {
		log.Info().
			Str("from", libreOfficeOutput).
			Str("to", out).
			Msg("🔄 LibreOffice 출력 파일명 변경")

		if err := os.Rename(libreOfficeOutput, out); err != nil {
			log.Error().Err(err).Msg("❌ 파일명 변경 실패")
			return err
		}
	}

	return nil
}

type ImageMagickTransformer struct{}

func (i ImageMagickTransformer) Supports(mime, target string) bool {
	// MIME 타입에서 charset 등의 파라미터 제거
	baseMime := strings.Split(mime, ";")[0]
	baseMime = strings.TrimSpace(baseMime)

	imageFormats := []string{"jpg", "jpeg", "png", "webp", "bmp", "gif", "svg", "tiff", "ico", "avif"}
	return strings.HasPrefix(baseMime, "image/") && contains(imageFormats, target)
}

func (i ImageMagickTransformer) Transform(in, out string) error {
	inputExt := safeGetExt(in)
	outputExt := safeGetExt(out)

	var cmd *exec.Cmd

	// 확장자가 없는 경우 파일 내용으로 포맷 감지
	var inputFormat string
	if inputExt == "" {
		// 파일 내용으로 포맷 감지
		if content, err := exec.Command("file", in).Output(); err == nil {
			fileInfo := strings.ToLower(string(content))
			// ICO 파일 우선 감지 (PNG보다 먼저 체크)
			if strings.Contains(fileInfo, "icon") || strings.Contains(fileInfo, "ico") || strings.Contains(fileInfo, "ms windows icon") {
				inputFormat = "ico"
			} else if strings.Contains(fileInfo, "gif") {
				inputFormat = "gif"
			} else if strings.Contains(fileInfo, "png") {
				inputFormat = "png"
			} else if strings.Contains(fileInfo, "jpeg") || strings.Contains(fileInfo, "jpg") {
				inputFormat = "jpeg"
			} else if strings.Contains(fileInfo, "webp") {
				inputFormat = "webp"
			} else if strings.Contains(fileInfo, "bmp") {
				inputFormat = "bmp"
			} else if strings.Contains(fileInfo, "tiff") {
				inputFormat = "tiff"
			}
		}
	} else {
		inputFormat = inputExt
	}

	// 파일 내용으로 GIF 여부 확인 (확장자가 없는 경우)
	isGif := inputFormat == "gif"

	// GIF 파일 특별 처리
	if isGif {
		switch outputExt {
		case "jpg", "jpeg":
			// GIF → JPG: 첫 번째 프레임만 추출, 배경색 지정
			if inputFormat != "" && inputExt == "" {
				// 확장자가 없는 경우 포맷 명시
				cmd = exec.Command("/usr/bin/magick", fmt.Sprintf("%s:%s[0]", inputFormat, in), "-background", "white", "-flatten", out)
			} else {
				cmd = exec.Command("/usr/bin/magick", in+"[0]", "-background", "white", "-flatten", out)
			}
		case "png":
			// GIF → PNG: 첫 번째 프레임만 추출, 투명도 유지
			if inputFormat != "" && inputExt == "" {
				cmd = exec.Command("/usr/bin/magick", fmt.Sprintf("%s:%s[0]", inputFormat, in), out)
			} else {
				cmd = exec.Command("/usr/bin/magick", in+"[0]", out)
			}
		case "bmp":
			// GIF → BMP: 첫 번째 프레임만 추출, 배경색 지정
			if inputFormat != "" && inputExt == "" {
				cmd = exec.Command("/usr/bin/magick", fmt.Sprintf("%s:%s[0]", inputFormat, in), "-background", "white", "-flatten", out)
			} else {
				cmd = exec.Command("/usr/bin/magick", in+"[0]", "-background", "white", "-flatten", out)
			}
		default:
			// 기본 변환 (webp, tiff, ico, avif 등)
			if inputFormat != "" && inputExt == "" {
				cmd = exec.Command("/usr/bin/magick", fmt.Sprintf("%s:%s", inputFormat, in), out)
			} else {
				cmd = exec.Command("/usr/bin/magick", in, out)
			}
		}
	} else {
		// 일반 이미지 변환
		switch outputExt {
		case "ico":
			// ICO 변환: 여러 크기 생성
			if inputFormat != "" && inputExt == "" {
				cmd = exec.Command("/usr/bin/magick", fmt.Sprintf("%s:%s", inputFormat, in), "-resize", "256x256", "-compress", "None", out)
			} else {
				cmd = exec.Command("/usr/bin/magick", in, "-resize", "256x256", "-compress", "None", out)
			}
		case "avif":
			// AVIF 변환: 품질 설정
			if inputFormat != "" && inputExt == "" {
				cmd = exec.Command("/usr/bin/magick", fmt.Sprintf("%s:%s", inputFormat, in), "-quality", "80", out)
			} else {
				cmd = exec.Command("/usr/bin/magick", in, "-quality", "80", out)
			}
		default:
			// 기본 ImageMagick magick 명령
			if inputFormat != "" && inputExt == "" {
				// 확장자가 없는 경우 포맷 명시: format:filename
				if inputFormat == "ico" {
					// ICO 파일의 경우 가장 큰 크기 선택 (일반적으로 마지막 인덱스)
					cmd = exec.Command("/usr/bin/magick", fmt.Sprintf("%s:%s[2]", inputFormat, in), out)
				} else {
					cmd = exec.Command("/usr/bin/magick", fmt.Sprintf("%s:%s", inputFormat, in), out)
				}
			} else {
				cmd = exec.Command("/usr/bin/magick", in, out)
			}
		}
	}

	log.Info().Strs("args", cmd.Args).Msg("🖼️ ImageMagick 명령 실행")

	output, err := cmd.CombinedOutput()
	if err != nil {
		log.Error().Err(err).Str("output", string(output)).Msg("❌ ImageMagick 변환 실패")
		return err
	}

	log.Info().Str("output", string(output)).Msg("✅ ImageMagick 변환 완료")
	return nil
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

// safeGetExt는 파일 경로에서 안전하게 확장자를 추출합니다
func safeGetExt(path string) string {
	ext := filepath.Ext(path)
	if len(ext) > 1 {
		return strings.ToLower(ext[1:]) // 점(.) 제거하고 소문자로
	}
	return "" // 확장자가 없으면 빈 문자열
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
			"status":           "completed",
			"download_url":     s3url,
			"download_token":   downloadToken,
			"token_expires_at": time.Now().Add(10 * time.Minute), // 토큰 10분 유효
			"updated_at":       time.Now(),
			"delete_after":     time.Now().Add(30 * time.Minute),
		})

	log.Info().Str("conversion_id", conv.ID).Str("download_token", downloadToken).Msg("🎉 변환 작업 완료")
}

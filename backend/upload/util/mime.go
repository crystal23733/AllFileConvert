package util

import (
	"mime/multipart"

	"github.com/gabriel-vasile/mimetype"
)

// DetectMime은 multipart.FileHeader에서 MIME타입을 반환합니다.
func DetectMime(h *multipart.FileHeader) (string, error) {
	f, err := h.Open()
	if err != nil {
		return "", err
	}
	defer f.Close()
	mt, err := mimetype.DetectReader(f)
	if err != nil {
		return "", err
	}

	mimeType := mt.String()

	// MIME 타입 정규화
	mimeType = normalizeMimeType(mimeType)

	return mimeType, nil
}

// normalizeMimeType은 MIME 타입을 표준화합니다.
func normalizeMimeType(mimeType string) string {
	switch mimeType {
	// 오디오 타입 정규화
	case "audio/x-wav":
		return "audio/wav"
	case "audio/x-flac":
		return "audio/flac"
	case "audio/x-m4a":
		return "audio/m4a"

	// 이미지 타입 정규화
	case "image/x-icon":
		return "image/vnd.microsoft.icon"

	// 문서 타입 정규화
	case "application/rtf":
		return "text/rtf"

	// 기본값은 그대로 반환
	default:
		return mimeType
	}
}

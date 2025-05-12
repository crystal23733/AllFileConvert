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

	return mt.String(), nil
}

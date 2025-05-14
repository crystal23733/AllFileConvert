// Package model은 GORM 모델은 정의합니다.
package model

import "time"

// File은 업로드된 원본 파일 구조체입니다.
type File struct {
	ID        string
	UserID    string
	Filename  string
	MimeType  string
	Size      int64
	CreatedAt time.Time
}

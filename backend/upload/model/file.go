// Package model은 GORM 모델은 정의합니다.
package model

import "time"

// File은 업로드된 원본 파일 정보를 저장합니다.
type File struct {
	ID        string    `gorm:"primaryKey;type:uuid"` // 파일 UUID
	UserID    string    `gorm:"type:uuid"`            // 익명 사용자 UUID
	Filename  string    // 원본 파일 이름
	MimeType  string    // MIME 타입
	Size      int64     // 바이트 단위 크기
	CreatedAt time.Time // 업로드 시각
}

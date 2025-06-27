package model

import "time"

type Conversion struct {
	ID            string `gorm:"primaryKey;type:uuid"`
	FileID        string `gorm:"type:uuid"`
	TargetFormat  string
	Status        string
	DownloadURL   string
	DownloadToken string // 다운로드 보안 토큰
	DownloadCount int
	CreatedAt     time.Time
	UpdatedAt     time.Time
	DeleteAfter   time.Time // 변환 완료 후 삭제 예정 시각
}

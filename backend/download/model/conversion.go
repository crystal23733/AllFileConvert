package model

import "time"

type Conversion struct {
	ID            string `gorm:"primaryKey;type:uuid"`
	FileID        string `gorm:"type:uuid"`
	TargetFormat  string
	Status        string
	DownloadURL   string
	DownloadCount int
	CreateAt      time.Time
	UpdatedAt     time.Time
	DeleteAfter   time.Time // 변환 완료 후 삭제 예정 시각
}

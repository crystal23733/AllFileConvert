// package model은 GORM 모델을 정의합니다.
package model

import "time"

// Conversion은 변경될 파일 모델, 다운로드 링크 등을 정의합니다.
type Conversion struct {
	ID            string `gorm:"primaryKey;type:uuid"` // 변환 작업 ID
	FileID        string `gorm:"type:uuid"`            // 업로드된 파일의 ID
	TargetFormat  string // 변환 목표 포맷 (mp4, pdf 등)
	Status        string // pending, processing, completed, failed
	DownloadURL   string // 완료 시 다운로드 경로
	DownloadCount int    // 다운로드 횟수
	CreatedAt     time.Time
	UpdatedAt     time.Time
	DeleteAfter   time.Time // 변환 완료 후 삭제 예정 시각
}

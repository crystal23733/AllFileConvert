// Package model은 피드백 관련 데이터 구조를 정의합니다.
package model

import "time"

// FeedbackRequest는 클라이언트로부터 받는 피드백 요청 구조입니다.
type FeedbackRequest struct {
	Type    string `json:"type" binding:"required,oneof=bug feature general"` // 피드백 타입
	Message string `json:"message" binding:"required,min=10,max=1000"`        // 피드백 내용
	Email   string `json:"email,omitempty" binding:"omitempty,email,max=100"` // 선택적 연락처
}

// FeedbackResponse는 클라이언트에게 보내는 응답 구조입니다.
type FeedbackResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	ID      string `json:"id,omitempty"` // 추적용 ID
}

// FeedbackLog는 로깅용 구조체입니다.
type FeedbackLog struct {
	ID        string    `json:"id"`
	Type      string    `json:"type"`
	ClientIP  string    `json:"client_ip"`
	Success   bool      `json:"success"`
	Error     string    `json:"error,omitempty"`
	Timestamp time.Time `json:"timestamp"`
}

// Package service는 이메일 전송 기능을 제공합니다.
package service

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/rs/zerolog/log"
	"gopkg.in/gomail.v2"
)

// EmailService는 이메일 전송을 담당하는 서비스입니다.
type EmailService struct {
	host     string
	port     int
	username string
	password string
	from     string
	to       string
}

// NewEmailService는 새로운 이메일 서비스 인스턴스를 생성합니다.
func NewEmailService() *EmailService {
	port, _ := strconv.Atoi(os.Getenv("SMTP_PORT"))
	if port == 0 {
		port = 587 // 기본 포트
	}

	return &EmailService{
		host:     os.Getenv("SMTP_HOST"),
		port:     port,
		username: os.Getenv("SMTP_USERNAME"),
		password: os.Getenv("SMTP_PASSWORD"),
		from:     os.Getenv("SMTP_FROM"),
		to:       os.Getenv("FEEDBACK_EMAIL"),
	}
}

// SendFeedback은 피드백을 이메일로 전송합니다.
func (s *EmailService) SendFeedback(feedbackType, message, userEmail, clientIP string) error {
	if s.host == "" || s.to == "" {
		log.Warn().Msg("SMTP 설정이 완료되지 않음. 이메일 전송 스킵")
		return nil // 개발 환경에서는 에러로 처리하지 않음
	}

	subject := fmt.Sprintf("[피드백] %s - %s", getFeedbackTypeKorean(feedbackType), time.Now().Format("2006-01-02 15:04"))

	body := fmt.Sprintf(`
새로운 피드백이 도착했습니다.

타입: %s
시간: %s
IP: %s
사용자 이메일: %s

내용:
%s

---
AllFileConvert 피드백 시스템
`, getFeedbackTypeKorean(feedbackType), time.Now().Format("2006-01-02 15:04:05"), clientIP, getEmailOrAnonymous(userEmail), message)

	m := gomail.NewMessage()
	m.SetHeader("From", s.from)
	m.SetHeader("To", s.to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/plain", body)

	// 사용자 이메일이 있으면 Reply-To 설정
	if userEmail != "" {
		m.SetHeader("Reply-To", userEmail)
	}

	d := gomail.NewDialer(s.host, s.port, s.username, s.password)

	log.Info().
		Str("type", feedbackType).
		Str("ip", clientIP).
		Msg("피드백 이메일 전송 시도")

	if err := d.DialAndSend(m); err != nil {
		log.Error().
			Err(err).
			Str("type", feedbackType).
			Str("ip", clientIP).
			Msg("피드백 이메일 전송 실패")
		return fmt.Errorf("이메일 전송 실패: %w", err)
	}

	log.Info().
		Str("type", feedbackType).
		Str("ip", clientIP).
		Msg("피드백 이메일 전송 성공")

	return nil
}

// getFeedbackTypeKorean은 피드백 타입을 한국어로 변환합니다.
func getFeedbackTypeKorean(feedbackType string) string {
	switch feedbackType {
	case "bug":
		return "버그 신고"
	case "feature":
		return "기능 제안"
	case "general":
		return "일반 문의"
	default:
		return "기타"
	}
}

// getEmailOrAnonymous는 이메일이 있으면 반환하고, 없으면 "익명"을 반환합니다.
func getEmailOrAnonymous(email string) string {
	if email == "" {
		return "익명"
	}
	return email
}

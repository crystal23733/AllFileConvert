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
func (s *EmailService) SendFeedback(feedbackType, message, userEmail string) error {
	if s.host == "" || s.to == "" {
		log.Warn().Msg("SMTP 설정이 완료되지 않음. 이메일 전송 스킵")
		return nil // 개발 환경에서는 에러로 처리하지 않음
	}

	subject := fmt.Sprintf("[피드백] %s - %s", getFeedbackTypeKorean(feedbackType), time.Now().Format("2006-01-02 15:04"))

	// 익명 여부 확인
	isAnonymous := userEmail == ""
	userInfo := getEmailOrAnonymous(userEmail)

	body := fmt.Sprintf(`📩 AllFileConvert 피드백이 도착했습니다

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 피드백 정보
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔸 피드백 타입: %s
🔸 접수 시간: %s
🔸 사용자: %s %s

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 피드백 내용
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

%s

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

시스템 정보:
- 서비스: AllFileConvert 피드백 시스템
- 익명 피드백: %s
- 생성 시간: %s

%s`,
		getFeedbackTypeKorean(feedbackType),
		time.Now().Format("2006-01-02 15:04:05"),
		userInfo,
		getAnonymousIndicator(isAnonymous),
		message,
		getBooleanKorean(isAnonymous),
		time.Now().Format(time.RFC3339),
		getReplyInstructions(isAnonymous))

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
		Bool("anonymous", isAnonymous).
		Msg("피드백 이메일 전송 시도")

	if err := d.DialAndSend(m); err != nil {
		log.Error().
			Err(err).
			Str("type", feedbackType).
			Bool("anonymous", isAnonymous).
			Msg("피드백 이메일 전송 실패")
		return fmt.Errorf("이메일 전송 실패: %w", err)
	}

	log.Info().
		Str("type", feedbackType).
		Bool("anonymous", isAnonymous).
		Msg("피드백 이메일 전송 성공")

	return nil
}

// getFeedbackTypeKorean은 피드백 타입을 한국어로 변환합니다.
func getFeedbackTypeKorean(feedbackType string) string {
	switch feedbackType {
	case "bug":
		return "🐛 버그 신고"
	case "feature":
		return "💡 기능 제안"
	case "improvement":
		return "⚡ 개선 요청"
	case "general":
		return "💬 일반 문의"
	default:
		return "❓ 기타"
	}
}

// getEmailOrAnonymous는 이메일이 있으면 반환하고, 없으면 "익명"을 반환합니다.
func getEmailOrAnonymous(email string) string {
	if email == "" {
		return "익명 사용자"
	}
	return email
}

// getAnonymousIndicator는 익명 여부에 따른 표시를 반환합니다.
func getAnonymousIndicator(isAnonymous bool) string {
	if isAnonymous {
		return "🔒"
	}
	return "📧"
}

// getBooleanKorean은 불린값을 한국어로 변환합니다.
func getBooleanKorean(value bool) string {
	if value {
		return "예"
	}
	return "아니오"
}

// getReplyInstructions는 답변 방법 안내를 반환합니다.
func getReplyInstructions(isAnonymous bool) string {
	if isAnonymous {
		return `
💡 답변 방법:
   익명 피드백이므로 직접 답변은 불가능합니다.
   필요시 공지사항이나 업데이트를 통해 개선사항을 알려드립니다.`
	}
	return `
💡 답변 방법:
   이 이메일에 직접 답장하시면 사용자에게 전달됩니다.`
}

/**
 * 피드백 종류를 나타내는 타입
 * @typedef {"bug" | "feature" | "improvement" | "general"} FeedbackType
 */
export type FeedbackType = "bug" | "feature" | "improvement" | "general";

/**
 * 피드백 전송 요청 데이터 인터페이스
 * @interface FeedbackRequest
 * @property {string} email - 사용자 이메일 주소
 * @property {FeedbackType} type - 피드백 종류
 * @property {string} message - 피드백 내용
 * @property {string} [url] - 현재 페이지 URL (선택사항)
 * @property {string} [userAgent] - 브라우저 정보 (선택사항)
 */
export interface FeedbackRequest {
  email: string;
  type: FeedbackType;
  message: string;
  url?: string;
  userAgent?: string;
}

/**
 * 피드백 전송 응답 데이터 인터페이스
 * @interface FeedbackResponse
 * @property {boolean} success - 전송 성공 여부
 * @property {string} message - 응답 메시지
 */
export interface FeedbackResponse {
  success: boolean;
  message: string;
}

/**
 * 피드백 타입 선택 옵션 인터페이스
 * @interface FeedbackTypeOption
 * @property {FeedbackType} value - 피드백 타입 값
 * @property {string} label - 화면에 표시될 라벨
 * @property {string} icon - 아이콘 이모지
 */
export interface FeedbackTypeOption {
  value: FeedbackType;
  label: string;
  icon: string;
} 
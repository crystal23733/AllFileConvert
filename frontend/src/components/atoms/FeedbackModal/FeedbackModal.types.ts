import { FeedbackRequest } from "@/types/feedback";

/**
 * FeedbackModal 컴포넌트의 Props 인터페이스
 * @interface FeedbackModalProps
 * @property {boolean} isOpen - 모달 표시 여부
 * @property {Function} onClose - 모달 닫기 콜백 함수
 * @property {Function} onSubmit - 피드백 전송 콜백 함수
 * @property {boolean} [isLoading] - 전송 중 상태 (선택사항)
 */
export interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: FeedbackRequest) => void;
  isLoading?: boolean;
}

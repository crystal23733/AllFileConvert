import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { FeedbackRequest } from "@/types/feedback";
import feedbackService from "@/services/feedback/FeedbackService";

/**
 * 피드백 전송을 위한 React Query 훅
 * 피드백 데이터를 서버로 전송하고 로딩 상태를 관리합니다
 * @returns {Object} mutation - React Query의 mutation 객체 (mutate, isPending, error 등 포함)
 */
export const useFeedback = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (feedback: FeedbackRequest) => {
      return feedbackService.sendFeedback(feedback);
    },
    onSuccess: data => {
      console.log("✅ Feedback sent successfully:", data);
      // 성공 시 추가 처리가 필요하면 여기에 추가
    },
    onError: (error: Error) => {
      console.error("❌ Failed to send feedback:", error);

      // 에러 메시지 처리
      const errorMessage = getErrorMessage(error.message, t);
      console.error("User-friendly error message:", errorMessage);
    },
  });
};

/**
 * 에러 코드를 다국어 메시지로 변환합니다
 * @param {string} errorCode - 에러 코드
 * @param {Function} t - 번역 함수
 * @returns {string} 사용자에게 표시할 에러 메시지
 */
function getErrorMessage(errorCode: string, t: (key: string) => string): string {
  switch (errorCode) {
    case "NETWORK_ERROR":
      return t("feedback.messages.networkError");
    case "RATE_LIMIT_EXCEEDED":
      return (
        t("feedback.messages.rateLimitError") || "요청이 너무 많습니다. 잠시 후 다시 시도해주세요."
      );
    case "SERVER_ERROR":
      return (
        t("feedback.messages.serverError") || "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    case "TIMEOUT_ERROR":
      return (
        t("feedback.messages.timeoutError") || "요청 시간이 초과되었습니다. 다시 시도해주세요."
      );
    case "BAD_REQUEST":
      return (
        t("feedback.messages.badRequestError") || "잘못된 요청입니다. 입력 내용을 확인해주세요."
      );
    default:
      return t("feedback.messages.error");
  }
}

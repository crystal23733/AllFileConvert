import { useMutation } from '@tanstack/react-query';
import { FeedbackRequest } from '@/types/feedback';
import feedbackService from '@/services/feedback/FeedbackService';

/**
 * 피드백 전송을 위한 React Query 훅
 * 피드백 데이터를 서버로 전송하고 로딩 상태를 관리합니다
 * @returns {Object} mutation - React Query의 mutation 객체 (mutate, isPending, error 등 포함)
 */
export const useFeedback = () => {
  return useMutation({
    mutationFn: (feedback: FeedbackRequest) => {
      return feedbackService.sendFeedback(feedback);
    },
    onSuccess: (data) => {
      console.log('✅ Feedback sent successfully:', data);
    },
    onError: (error) => {
      console.error('❌ Failed to send feedback:', error);
    },
  });
}; 
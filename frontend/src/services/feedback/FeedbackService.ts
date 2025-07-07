import axios from 'axios';
import { FeedbackRequest, FeedbackResponse } from '@/types/feedback';

/**
 * 피드백 관련 API 서비스 클래스
 * 사용자 피드백을 서버로 전송하는 기능을 담당
 * @class
 */
class FeedbackService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  }

  /**
   * 사용자 피드백을 서버로 전송합니다
   * @param {FeedbackRequest} feedback - 피드백 데이터 (이메일, 타입, 메시지 포함)
   * @returns {Promise<FeedbackResponse>} 피드백 전송 결과
   * @throws {Error} 네트워크 오류 또는 서버 오류
   */
  async sendFeedback(feedback: FeedbackRequest): Promise<FeedbackResponse> {
    try {
      // TODO: 백엔드 API 엔드포인트가 구현되면 실제 API 호출로 변경
      // const response = await axios.post(`${this.baseURL}/api/feedback`, feedback);
      // return response.data;

      // 현재는 Mock 응답 (개발용)
      console.log('📧 Feedback submitted:', {
        timestamp: new Date().toISOString(),
        ...feedback,
      });

      // 2초 지연 후 성공 응답 (실제 API 호출 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 랜덤하게 성공/실패 시뮬레이션 (10% 확률로 실패)
      if (Math.random() < 0.1) {
        throw new Error('Network simulation error');
      }

      return {
        success: true,
        message: 'Feedback sent successfully',
      };

    } catch (error) {
      console.error('Failed to send feedback:', error);
      
      // 네트워크 오류 처리
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new Error('NETWORK_ERROR');
        }
        
        // 서버 오류 처리
        const status = error.response.status;
        if (status >= 500) {
          throw new Error('SERVER_ERROR');
        }
        
        // 클라이언트 오류 처리
        if (status >= 400) {
          throw new Error(error.response.data?.message || 'Bad request');
        }
      }
      
      // 기타 오류
      throw new Error('UNKNOWN_ERROR');
    }
  }

  /**
   * 실제 백엔드 API로 피드백을 전송합니다 (미래 구현용)
   * @param {FeedbackRequest} feedback - 피드백 데이터
   * @returns {Promise<FeedbackResponse>} 피드백 전송 결과
   * @throws {Error} 네트워크 오류 또는 서버 오류
   */
  private async sendFeedbackToAPI(feedback: FeedbackRequest): Promise<FeedbackResponse> {
    const response = await axios.post(`${this.baseURL}/api/feedback`, {
      email: feedback.email,
      type: feedback.type,
      message: feedback.message,
      metadata: {
        url: feedback.url,
        userAgent: feedback.userAgent,
        timestamp: new Date().toISOString(),
      },
    });

    return response.data;
  }
}

// 싱글톤 인스턴스 생성
const feedbackService = new FeedbackService();

export default feedbackService; 
import axios from "axios";
import { FeedbackRequest, FeedbackResponse } from "@/types/feedback";

/**
 * 피드백 관련 API 서비스 클래스
 * 사용자 피드백을 서버로 전송하는 기능을 담당
 * @class
 */
class FeedbackService {
  private readonly feedbackURL: string;

  constructor() {
    // 피드백 서비스는 포트 8084에서 실행 (Docker)
    this.feedbackURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost";
  }

  /**
   * 사용자 피드백을 서버로 전송합니다
   * @param {FeedbackRequest} feedback - 피드백 데이터 (이메일, 타입, 메시지 포함)
   * @returns {Promise<FeedbackResponse>} 피드백 전송 결과
   * @throws {Error} 네트워크 오류 또는 서버 오류
   */
  async sendFeedback(feedback: FeedbackRequest): Promise<FeedbackResponse> {
    try {
      console.log("📧 Sending feedback to backend:", {
        timestamp: new Date().toISOString(),
        type: feedback.type,
        messageLength: feedback.message.length,
        hasEmail: !!feedback.email,
        url: feedback.url,
      });

      // 실제 백엔드 API 호출
      const response = await axios.post(
        `${this.feedbackURL}/feedback`,
        {
          email: feedback.email || "", // 익명 피드백은 빈 문자열
          type: feedback.type,
          message: feedback.message,
          url: feedback.url,
          userAgent: feedback.userAgent,
        },
        {
          timeout: 10000, // 10초 타임아웃
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Feedback sent successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to send feedback:", error);

      // 네트워크 오류 처리
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new Error("NETWORK_ERROR");
        }

        const status = error.response.status;
        const data = error.response.data;

        // Rate limit 처리 (429)
        if (status === 429) {
          throw new Error("RATE_LIMIT_EXCEEDED");
        }

        // 서버 오류 처리 (5xx)
        if (status >= 500) {
          throw new Error("SERVER_ERROR");
        }

        // 클라이언트 오류 처리 (4xx)
        if (status >= 400) {
          throw new Error(data?.message || "BAD_REQUEST");
        }
      }

      // 타임아웃 오류
      if (error && typeof error === "object" && "code" in error && error.code === "ECONNABORTED") {
        throw new Error("TIMEOUT_ERROR");
      }

      // 기타 오류
      throw new Error("UNKNOWN_ERROR");
    }
  }

  /**
   * 피드백 서비스의 헬스 체크
   * @returns {Promise<boolean>} 서비스 상태
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.feedbackURL}/health`, {
        timeout: 5000,
      });
      return response.status === 200;
    } catch (error) {
      console.warn("⚠️ Feedback service health check failed:", error);
      return false;
    }
  }
}

// 싱글톤 인스턴스 생성
const feedbackService = new FeedbackService();

export default feedbackService;

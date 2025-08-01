import { Status } from "@/components/common/ProgressBar.types";
import axios, { AxiosResponse } from "axios";

/**
 * 변환 상태 API 응답 타입
 * @property {Status} status - 상태
 * @property {string} download_url - 다운로드 경로
 * @property {string} download_token - 다운로드 보안 토큰
 */
export interface ConvertStatusResponse {
  status: Status;
  download_url?: string;
  download_token?: string;
}

/**
 * ConvertStatusService는 변환 상태를 조회하는 단일 책임 클래스
 */
class ConvertStatusService {
  private static instance: ConvertStatusService;
  private readonly apiBaseURL: string;

  private constructor() {
    this.apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost";
  }

  /**
   * 전역에서 ConvertStatusService 인스턴스를 반환
   * @returns {ConvertStatusService}
   */
  static getInstance(): ConvertStatusService {
    if (!ConvertStatusService.instance) ConvertStatusService.instance = new ConvertStatusService();
    return ConvertStatusService.instance;
  }

  /**
   * 변환 상태를 조회
   * @param {string} conversionId - 변환 작업 ID
   * @returns  {Promise<ConvertStatusResponse>} 변환 상태 응답
   * @throws {Error} 요청 실패 시 예외 발생
   */
  async getStatus(conversionId: string): Promise<ConvertStatusResponse> {
    const response: AxiosResponse<ConvertStatusResponse> = await axios.get(
      `${this.apiBaseURL}/convert/status/${conversionId}`
    );
    return response.data;
  }
}

export default ConvertStatusService.getInstance();

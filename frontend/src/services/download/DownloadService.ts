import axios, { AxiosResponse } from "axios";

/**
 * DownloadService 클래스는 변환된 파일을 다운로드하는 기능을 제공
 */
class DownloadService {
  private static instance: DownloadService;
  private readonly apiBaseURL: string;

  private constructor() {
    this.apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost";
  }

  /**
   * 전역에서 DownloadService 인스턴스를 반환
   * @returns {DownloadService}
   */
  static getInstance(): DownloadService {
    if (!DownloadService.instance) DownloadService.instance = new DownloadService();
    return DownloadService.instance;
  }

  /**
   * 변환 파일을 다운로드 (보안 강화: POST + body 토큰)
   * @param {string} conversionId - 변환 작업의 UUID
   * @param {string} token - 다운로드 보안 토큰 (일회용)
   * @returns {Promise<Blob>} 다운로드된 Blob 객체
   */
  async download(conversionId: string, token: string): Promise<Blob> {
    const url = `${this.apiBaseURL}/download/${conversionId}`;

    // POST 요청으로 토큰을 body에 포함 (보안 강화)
    const response: AxiosResponse<Blob> = await axios.post(
      url,
      { token }, // body에 토큰 포함
      {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
}

export default DownloadService.getInstance();

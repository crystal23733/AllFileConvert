import axios, { AxiosResponse } from "axios";

/**
 * DownloadService 클래스는 변환된 파일을 다운로드하는 기능을 제공
 */
class DownloadService {
  private static instance: DownloadService;
  private constructor() {}

  /**
   * 전역에서 DownloadService 인스턴스를 반환
   * @returns {DownloadService}
   */
  static getInstance(): DownloadService {
    if (!DownloadService.instance) DownloadService.instance = new DownloadService();
    return DownloadService.instance;
  }

  /**
   * 변환 파일을 다운로드
   * @param {string} conversionId - 변환 작업의 UUID
   * @returns {Promise<Blob>} 다운로드된 Blob 객체
   */
  async download(conversionId: string): Promise<Blob> {
    const response: AxiosResponse<Blob> = await axios.get(`/api/download/${conversionId}`, {
      responseType: "blob",
    });
    return response.data;
  }
}

export default DownloadService.getInstance();

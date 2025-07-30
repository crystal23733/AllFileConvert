import axios, { AxiosResponse } from "axios";

/**
 * 파일 업로드 요청 응답 타입
 * @typedef {Object} FileUploadResponse
 * @property {string} file_id - 업로드 후 반환되는 파일 식별자
 */
export interface FileUploadResponse {
  file_id: string;
}

/**
 * 파일 업로드 등 파일 관련 서버 API 호출을 담당하는 서비스 클래스
 * 싱글톤 패턴으로 전역 인스턴스가 한 번만 생성됨
 * @class
 */
class FileService {
  private static instance: FileService;
  private readonly apiBaseURL: string;

  /**
   * 외부에서 직접 생성하지 못하도록 생성자 숨김
   */
  private constructor() {
    this.apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost";
  }

  /**
   * 전역에서 FileService 인스턴스를 반환
   * @returns {FileService}
   */
  static getInstance(): FileService {
    if (!FileService.instance) FileService.instance = new FileService();
    return FileService.instance;
  }

  /**
   * 파일을 서버에 업로드합니다.
   * @param {File} file - 업로드할 파일
   * @returns {Promise<FileUploadResponse>} 업로드 결과 (file_id 반환)
   * @throws {Error} 네트워크/응답 오류
   */
  async upload(file: File): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response: AxiosResponse<FileUploadResponse> = await axios.post(
      `${this.apiBaseURL}/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data;
  }
}

export default FileService.getInstance();

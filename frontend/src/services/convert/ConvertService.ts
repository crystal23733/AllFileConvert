import axios, { AxiosResponse } from "axios";

/**
 * 파일 변환 요청 폼
 * @property {string} file_id - 파일의 아이디
 * @property {string} tartget_format - 파일을 변환할 포맷
 */
export interface ConvertRequest {
  file_id: string;
  target_format: string;
}

/**
 * 파일 변환 응답
 * @property {string} conversion_id - 변환 아이디
 */
export interface ConvertResponse {
  conversion_id: string;
}

/**
 * 파일 변환 요청을 담당하는 싱글톤 서비스 클래스
 * @class
 */
class ConvertService {
  private static instance: ConvertService;

  /**
   * 외부에서 직접 생성하지 못하도록 생성자 숨김
   */
  private constructor() {}

  /**
   * 전역에서 ConversionService 인스턴스를 반환
   * @returns {ConvertService}
   */
  static getInstance(): ConvertService {
    if (!ConvertService.instance) ConvertService.instance = new ConvertService();
    return ConvertService.instance;
  }

  /**
   * 파일 변환 요청
   * @param {ConvertRequest} data - 파일 ID 및 변환 포맷
   * @returns {Promise<ConvertResponse>} 변환 작업 ID 반환
   */
  async convert(data: ConvertRequest): Promise<ConvertResponse> {
    const response: AxiosResponse<ConvertResponse> = await axios.post(
      "http://localhost/api/convert",
      data
    );
    return response.data;
  }
}

export default ConvertService.getInstance();

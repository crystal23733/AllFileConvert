import {
  DOCUMENT_FORMATS,
  IMAGE_FORMATS,
  VIDEO_FORMATS,
  AUDIO_FORMATS,
  ARCHIVE_FORMATS,
  getSupportedFormats,
  getFormatCategory,
} from "@/constants/convertFormats";
import { FileCategory, FormatOption } from "@/types/conversion";

export default class FormatManager {
  /**
   * 파일 카테고리에 따른 변환 가능 포맷 리턴
   * @param {FileCategory} category - 변환할 파일 종류
   * @returns {FormatOption[]}
   */
  static getFormats(category: FileCategory): FormatOption[] {
    switch (category) {
      case "video":
        return VIDEO_FORMATS;
      case "image":
        return IMAGE_FORMATS;
      case "document":
        return DOCUMENT_FORMATS;
      case "audio":
        return AUDIO_FORMATS;
      case "archive":
        return ARCHIVE_FORMATS;
      default:
        return [];
    }
  }

  /**
   * MIME 타입에 따른 지원 가능한 변환 포맷 리턴 (더 정확한 방식)
   * @param {string} mimeType - 파일의 MIME 타입
   * @returns {FormatOption[]}
   */
  static getFormatsByMimeType(mimeType: string): FormatOption[] {
    return getSupportedFormats(mimeType);
  }

  /**
   * MIME 타입으로 파일 카테고리 결정
   * @param {string} mimeType - 파일의 MIME 타입
   * @returns {FileCategory}
   */
  static getCategoryByMimeType(mimeType: string): FileCategory {
    const category = getFormatCategory(mimeType);

    // 타입 변환 (기존 FileCategory와 맞춤)
    switch (category) {
      case "video":
        return "video";
      case "image":
        return "image";
      case "document":
        return "document";
      case "audio":
        return "audio" as FileCategory; // 확장된 카테고리
      case "archive":
        return "archive" as FileCategory; // 확장된 카테고리
      default:
        return "document"; // 기본값
    }
  }

  /**
   * 특정 MIME 타입이 변환 지원되는지 확인
   * @param {string} mimeType - 확인할 MIME 타입
   * @returns {boolean}
   */
  static isSupported(mimeType: string): boolean {
    return getSupportedFormats(mimeType).length > 0;
  }
}

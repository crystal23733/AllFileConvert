import { DOCUMENT_FORMATS, IMAGE_FORMATS, VIDEO_FORMATS } from "@/constants/convertFormats";
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
      default:
        return [];
    }
  }
}

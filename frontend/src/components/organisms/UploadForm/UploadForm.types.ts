import Option from "../../common/Option.types";

/**
 * @property {(files: File[]) => void} onFileDrop - 파일 드롭시 호출 함수
 * @property {string} selectedFormat - 선택된 포맷 값
 * @property {(v: string) => void} onFormatChange - 포맷 변경 시 호출되는 콜백
 * @property {() => void} onSubmit - 폼 제출 시 호출
 * @property {boolean} isSubmitting - 업로드 진행 상태
 * @property {boolean} disabled - 활성화 여부
 * @property {Option[]} formatOptions - 포맷 선택 옵션 배열
 * @property {string} className - 클래스
 */
export default interface UploadFormProps {
  onFileDrop: (files: File[]) => void;
  selectedFormat: string;
  onFormatChange: (v: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  disabled?: boolean;
  formatOptions: Option[];
  className?: string;
}

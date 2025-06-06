import { Accept } from "react-dropzone";

/**
 * 드랍존의 속성 정의
 * @property {(File[]) => void} ondrop - 드랍될 속성(파일들)을 정의
 * @property {boolean} disabled - 드랍존 활성화 여부
 * @property {Accept} accept - 변환 파일 형태
 * @property {boolean} multiple - 파일 다수 여부
 * @property {string} className - 클래스 이름
 */
export default interface DropzoneProps {
  onDrop: (acceptedFile: File[]) => void;
  disabled?: boolean;
  accept?: Accept;
  multiple?: boolean;
  className?: string;
}

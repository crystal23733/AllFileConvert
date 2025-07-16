/**
 * 업로드 된 파일의 정보
 * @property {string} name - 파일 이름
 * @property {number} size - 파일 크기
 * @property {string} type - 파일 마임타입
 */
interface PreviewFile {
  name: string;
  size: number;
  type: string;
}

/**
 * 업로드된 파일 컴포넌트 타입
 * @property {PreviewFile[]} files - 업로드된 파일들
 * @property {(index:number) => void} onRemove - 지울 때 호출될 함수
 * @property {string} className - 클래스
 */
export default interface UploadPreviewProps {
  files: PreviewFile[];
  onRemove?: (index: number) => void;
  className?: string;
}

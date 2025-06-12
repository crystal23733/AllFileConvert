/**
 * 파일 썸네일 타입 정의
 * @property {string} url - 링크
 * @property {string} type - 파일 타입
 * @property {string} filename - 파일 이름
 * @property {string} className - 클래스
 */
export default interface ResultPreviewProps {
  url: string;
  type: string;
  filename?: string;
  className?: string;
}

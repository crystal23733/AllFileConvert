/**
 * 다운로드 버튼 속성
 * @property {() => void} onClick - 클릭 시 호출되는 함수
 * @property {boolean} disabled - 활성화 상태
 * @property {string} className - 클래스
 * @property {string} label - 라벨
 */
export default interface DownloadButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

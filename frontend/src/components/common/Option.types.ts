/**
 * 변환 포맷 옵션 타입
 * @property {string} value - 옵션의 실제 값(예: 'mp4', 'pdf')
 * @property {string} label - 화면에 표시될 텍스트(예: 'MP4(동영상)')
 */
export default interface Option {
  value: string;
  label: string;
}

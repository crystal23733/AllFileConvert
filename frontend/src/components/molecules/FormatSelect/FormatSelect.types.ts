import Option from "@/components/common/Option.types";

/**
 * FormatSelect 컴포넌트의 props
 * @property {string} value - 선택된 포맷 값
 * @property {v: string => void} onChange - 선택 변경 시 호출되는 함수
 * @property {Option[]} options - 선택 가능한 포맷 옵션 목록
 * @property {string} label - label 이름
 * @property {boolean} disabled - 비활성화 여부 (선택)
 * @property {string} className - 추가 스타일 클래스 (선택)
 * @property {string} id - 연결할 라벨 아이디
 */
export default interface FormatSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  label?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

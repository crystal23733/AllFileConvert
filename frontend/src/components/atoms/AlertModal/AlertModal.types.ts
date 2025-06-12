import { ReactNode } from "react";

/**
 * 모달 속성 정의
 * @property {boolean} open - 모달 상태
 * @property {ReactNode} message - 모달 내부에 표시할 메세지
 * @property {() => void} onClose - "확인" 버튼 또는 모달 외부를 클릭했을 때 실행할 콜백 함수
 * @property {string} confirmLabel - 확인 버튼에 들어갈 텍스트
 */
export default interface AlertModalProps {
  open: boolean;
  message: ReactNode;
  onClose: () => void;
  confirmLabel?: string;
}

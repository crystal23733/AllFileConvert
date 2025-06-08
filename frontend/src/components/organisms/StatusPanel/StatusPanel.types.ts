type Status = "idle" | "pending" | "processing" | "completed" | "failed";

/**
 * 스테이터스 패널 타입 정의
 * @property {Status} status - 상태
 * @property {string} downloadUrl - 다운로드 링크
 * @property {() => void} onDownload - 다운로드 클릭 시 호출될 함수
 * @property {boolean} isPolling - 주기적인 상태 질문
 * @property {string} error - 에러 메세지
 * @property {string} className - 클래스
 */
export default interface StatusPanelProps {
  status: Status;
  downloadUrl?: string;
  onDownload?: () => void;
  isPolling?: boolean;
  error?: string;
  className?: string;
}

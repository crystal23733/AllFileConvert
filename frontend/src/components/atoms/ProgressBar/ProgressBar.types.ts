/**
 * @type Status - 동영상 상태 응답
 */
export type Status = "pending" | "processing" | "completed" | "failed";

/**
 * ProgressBar의 속성
 * @property {Status}status - 동영상 변환 진행상태를 알려주는 속성입니다.
 */
export default interface ProgressBarProps {
  status: Status;
}

import { Status } from "@/components/common/ProgressBar.types";

/**
 * 상황에 따른 상태 메세지
 */
const statusLabel: Record<Status, string> = {
  pending: "대기 중",
  processing: "진행 중...",
  completed: "완료 되었습니다.",
  failed: "변환을 실패하였습니다.",
};

export default statusLabel;

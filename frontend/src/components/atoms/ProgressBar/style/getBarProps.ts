import { Status } from "../../../common/ProgressBar.types";

/**
 * 동영상 변환 상태에 따른 스타일 정의
 */
export default (status: Status) => {
  switch (status) {
    case "pending":
      return { value: 0, color: "bg-gray-300" };
    case "processing":
      return { value: 50, color: "bg-blue-400 animate-pulse" };
    case "completed":
      return { value: 100, color: "bg-green-500" };
    case "failed":
      return { value: 100, color: "bg-red-500" };
    default:
      return { value: 0, color: "bg-gray-300" };
  }
};

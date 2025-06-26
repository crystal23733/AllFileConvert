import ConvertStatusService, {
  ConvertStatusResponse,
} from "@/services/convert/ConvertStatusService";
import { useQuery } from "@tanstack/react-query";

/**
 * 변환 상태 조회 훅 (폴링 주기 ms 단위, 기본 2초)
 */
export default (conversionId: string | null, pollingMs: number = 2000) => {
  return useQuery<ConvertStatusResponse, Error>({
    queryKey: ["convertStatus", conversionId],
    queryFn: () => {
      if (!conversionId) return Promise.reject(new Error("conversionId가 필요합니다."));
      return ConvertStatusService.getStatus(conversionId);
    },
    enabled: !!conversionId,
    refetchInterval: query => {
      // failed나 completed 상태일 때는 polling 중단
      const status = query.state.data?.status;
      if (status === "failed" || status === "completed") {
        return false;
      }
      return conversionId ? pollingMs : false;
    },
  });
};

import DownloadService from "@/services/download/DownloadService";
import { useMutation } from "@tanstack/react-query";

/**
 * 변환된 파일 다운로드 상태와 결과를 관리
 */
interface DownloadRequest {
  conversionId: string;
  token: string;
}

export default () => {
  return useMutation<Blob, Error, DownloadRequest>({
    mutationFn: ({ conversionId, token }: DownloadRequest) => 
      DownloadService.download(conversionId, token),
  });
};

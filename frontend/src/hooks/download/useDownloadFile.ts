import DownloadService from "@/services/download/DownloadService";
import { useMutation } from "@tanstack/react-query";

/**
 * 변환된 파일 다운로드 상태와 결과를 관리
 */
export default () => {
  return useMutation<Blob, Error, string>({
    mutationFn: (conversionId: string) => DownloadService.download(conversionId),
  });
};

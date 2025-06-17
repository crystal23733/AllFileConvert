import { FileCategory } from "@/types/conversion";
import { useState } from "react";
import useUploadFile from "../upload/useUploadFile";
import useConvertFile from "../convert/useConvertFile";
import useConvertStatus from "../convert/useConvertStatus";
import useDownloadFile from "../download/useDownloadFile";
import FormatManager from "@/services/FormatManager";

interface UseFileConvertFlowOptions {
  initialCategory?: FileCategory;
}

/**
 * 파일 업로드->변환->상태조회->다운로드 전반의 상태 및 로직을 관리하는 통합 훅
 * - 파일 드롭, 업로드, 변환 요청, 상태 폴링, 다운로드, 에러 핸들링까지 한번에 제공
 * @param {UseFileConvertFlowOptions} options - 초깃값(카테고리) 등 세팅용
 * @returns {UseFileConvertFlowReturn} 페이지에서 필요한 상태, 헬퍼, 핸들러, 에러, 다운로드 등 통합 반환
 */
export default ({ initialCategory = "video" }: UseFileConvertFlowOptions = {}) => {
  // 상태: 업로드 파일, 포맷, 카테고리, 변환ID, 진행상태, 파일명 등
  const [files, setFiles] = useState<File[]>([]);
  const [fileId, setFileId] = useState<string | null>(null);
  const [format, setFormat] = useState<string>("");
  const [category, setCategory] = useState<FileCategory>(initialCategory);
  const [conversionId, setConversionId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "pending" | "processing" | "completed" | "failed">(
    "idle"
  );
  const [downloadFileName, setDownloadFileName] = useState<string>("");

  // API 훅
  const uploadFile = useUploadFile();
  const convertFile = useConvertFile();
  const convertStatus = useConvertStatus(conversionId);
  const downloadFile = useDownloadFile();

  /**
   * 파일 드롭 시 호출, 파일/카테고리/포맷 상태 초기화
   * @param {File[]} selected  - 사용자가 업로드한 파일 목록
   */
  const handleFileDrop = (selected: File[]) => {
    setFiles(selected);
    setFileId(null);
    setConversionId(null);
    setStatus("idle");
    if (selected[0]) {
      const mime = selected[0].type;
      if (mime.startsWith("video/")) setCategory("video");
      else if (mime.startsWith("image/")) setCategory("image");
      else setCategory("document");
      setFormat(FormatManager.getFormats(category)[0]?.value ?? "");
    }
  };

  /**
   * 업로드/변환 요청 트리거
   * @param {() => void}[onSuccess] - 성공 콜백
   * @param {(msg: string) => void} [onError] - 에러 콜백
   */
  const handleSubmit = (onSuccess?: () => void, onError?: (msg: string) => void) => {
    if (!files[0] || !format) return;
    setStatus("pending");
    uploadFile.mutate(files[0], {
      onSuccess: data => {
        setFileId(data.file_id);
        setDownloadFileName(files[0].name);
        convertFile.mutate(
          { file_id: data.file_id, target_format: format },
          {
            onSuccess: cdata => {
              setConversionId(cdata.conversion_id);
              setStatus("processing");
              onSuccess?.();
            },
            onError: err => {
              setStatus("failed");
              onError?.(err.message);
            },
          }
        );
      },
      onError: err => {
        setStatus("failed");
        onError?.(err.message);
      },
    });
  };

  /**
   * 변환된 파일 다운로드 트리거
   * @param {(msg: string) => void} [onError] - 에러 콜백
   */
  const handleDownload = (onError?: (msg: string) => void) => {
    if (!conversionId) return;
    downloadFile.mutate(conversionId, {
      onSuccess: blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = downloadFileName || "result";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
      onError: err => {
        onError?.(err.message);
      },
    });
  };

  // 상태 자동 업데이트
  const conversionStatus = convertStatus.data?.status;
  if (conversionStatus && conversionStatus !== status) {
    setStatus(conversionStatus);
  }

  // 포맷 리스트
  const formatOptions = FormatManager.getFormats(category);

  return {
    // 상태
    files,
    fileId,
    format,
    category,
    conversionId,
    status,
    downloadFileName,
    setFormat,
    // API 상태
    uploadFile,
    convertFile,
    convertStatus,
    downloadFile,
    // 헬퍼
    formatOptions,
    // 핸들러
    handleFileDrop,
    handleSubmit,
    handleDownload,
    // 에러/다운로드 URL 등 추가 반환
    error: convertFile.error?.message || convertStatus.error?.message,
    downloadUrl: convertStatus.data?.download_url,
  };
};

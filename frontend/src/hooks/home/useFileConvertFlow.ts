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
  const [downloadCompleted, setDownloadCompleted] = useState<boolean>(false);
  const [originalFileName, setOriginalFileName] = useState<string>(""); // 원본 파일명 저장

  // API 훅 - 다운로드 완료시 폴링 중단
  const uploadFile = useUploadFile();
  const convertFile = useConvertFile();
  const convertStatus = useConvertStatus(downloadCompleted ? null : conversionId);
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
    setDownloadCompleted(false);
    if (selected[0]) {
      const mime = selected[0].type;

      // 지원 여부 확인
      const isSupported = FormatManager.isSupported(mime);
      if (!isSupported) {
        setStatus("failed"); // 지원하지 않는 파일은 바로 실패 상태로
        return;
      }

      // 새로운 MIME 기반 카테고리 및 포맷 결정
      const newCategory = FormatManager.getCategoryByMimeType(mime);
      setCategory(newCategory);

      // MIME 타입에 따른 지원 가능한 포맷 목록에서 첫 번째를 기본값으로
      const supportedFormats = FormatManager.getFormatsByMimeType(mime);
      const initialFormat =
        supportedFormats[0]?.value ?? FormatManager.getFormats(newCategory)[0]?.value ?? "";
      setFormat(initialFormat);

      // 원본 파일명 저장 및 초기 다운로드 파일명 설정
      setOriginalFileName(selected[0].name);
      if (initialFormat) {
        const nameWithoutExt =
          selected[0].name.substring(0, selected[0].name.lastIndexOf(".")) || selected[0].name;
        setDownloadFileName(`${nameWithoutExt}.${initialFormat}`);
      }
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
    setDownloadCompleted(false);

    // 원본 파일명에서 확장자 제거 후 새 확장자 추가
    const originalName = files[0].name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf(".")) || originalName;
    const newFileName = `${nameWithoutExt}.${format}`;

    uploadFile.mutate(files[0], {
      onSuccess: data => {
        setFileId(data.file_id);
        setDownloadFileName(newFileName); // 변환된 포맷에 맞는 파일명
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
    if (!conversionId) {
      onError?.("변환 ID가 없습니다.");
      return;
    }

    const downloadToken = convertStatus.data?.download_token;

    // 토큰이 없으면 다운로드 차단 (보안 강화)
    if (!downloadToken) {
      onError?.("다운로드 토큰이 만료되었거나 유효하지 않습니다. 파일을 다시 변환해주세요.");
      return;
    }

    // POST 방식으로 토큰을 body에 포함하여 다운로드 (보안 강화)
    downloadFile.mutate(
      { conversionId, token: downloadToken },
      {
        onSuccess: blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = downloadFileName || "result";
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);

          // 다운로드 완료 후 폴링 중단 (일회용 토큰으로 재다운로드 불가)
          setDownloadCompleted(true);
        },
        onError: err => {
          // 토큰 만료 시 사용자에게 명확한 안내
          if (err.message.includes("403") || err.message.includes("토큰")) {
            onError?.("다운로드 토큰이 만료되었습니다. 보안을 위해 파일을 다시 변환해주세요.");
          } else {
            onError?.(err.message);
          }
        },
      }
    );
  };

  // 상태 자동 업데이트
  const conversionStatus = convertStatus.data?.status;
  if (conversionStatus && conversionStatus !== status) {
    setStatus(conversionStatus);
  }

  // 포맷 리스트
  const formatOptions = FormatManager.getFormats(category);

  // 포맷이 변경될 때마다 다운로드 파일명 업데이트
  const updateDownloadFileName = (newFormat: string) => {
    if (originalFileName) {
      const nameWithoutExt =
        originalFileName.substring(0, originalFileName.lastIndexOf(".")) || originalFileName;
      const newFileName = `${nameWithoutExt}.${newFormat}`;
      setDownloadFileName(newFileName);
    }
  };

  // 포맷 설정 함수 (외부에서 호출)
  const setFormatWithUpdate = (newFormat: string) => {
    setFormat(newFormat);
    updateDownloadFileName(newFormat);
  };

  return {
    // 상태
    files,
    fileId,
    format,
    category,
    conversionId,
    status,
    downloadFileName,
    downloadCompleted,
    setFormat: setFormatWithUpdate,
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

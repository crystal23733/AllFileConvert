"use client";

import React from "react";
import { UNSUPPORTED_FORMATS } from "@/constants/convertFormats";

interface UnsupportedFileWarningProps {
  fileName: string;
  mimeType: string;
  className?: string;
}

const UnsupportedFileWarning: React.FC<UnsupportedFileWarningProps> = ({
  fileName,
  mimeType,
  className = "",
}) => {
  const getFileTypeMessage = (mime: string) => {
    // PDF 특별 케이스
    if (mime === "application/pdf") {
      return "PDF 파일 (입력 변환 지원 안함)";
    }

    // 동적으로 UNSUPPORTED_FORMATS 체크
    if (UNSUPPORTED_FORMATS.includes(mime)) {
      if (mime.includes("executable") || mime.includes("msdownload")) {
        return "실행 파일";
      }
      if (mime.includes("sqlite") || mime.includes("access")) {
        return "데이터베이스 파일";
      }
      if (mime.includes("font")) {
        return "폰트 파일";
      }
      if (mime.includes("pkcs") || mime.includes("cert")) {
        return "인증서 파일";
      }
      if (mime.includes("flash")) {
        return "Flash 파일";
      }
    }

    // 일반적인 카테고리별 메시지
    if (mime.startsWith("application/") && mime.includes("apple")) {
      return "Apple 전용 포맷 (Pages, Numbers, Keynote)";
    }
    if (mime === "application/zip" || mime.includes("compress") || mime.includes("archive")) {
      return "압축 파일";
    }

    return "지원하지 않는 파일 형식";
  };

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <span className="text-2xl">⚠️</span>
        </div>
        <div className="flex-1">
          <h3 className="text-red-800 font-semibold mb-1">지원하지 않는 파일 형식</h3>
          <p className="text-red-700 text-sm mb-2">
            <strong>{fileName}</strong>은(는) {getFileTypeMessage(mimeType)}으로 현재 변환을
            지원하지 않습니다.
          </p>
          {mimeType === "application/pdf" ? (
            <div className="text-red-600 text-xs">
              <p>
                📄 <strong>PDF 변환 안내:</strong>
              </p>
              <ul className="list-disc ml-4 mt-1">
                <li>
                  PDF는 변환의 <strong>출력 대상</strong>으로만 사용할 수 있습니다
                </li>
                <li>다른 문서를 PDF로 변환: DOCX → PDF, XLSX → PDF, PPTX → PDF</li>
                <li>PDF에서 다른 포맷으로는 기술적 제약으로 변환할 수 없습니다</li>
              </ul>
            </div>
          ) : (
            <div className="text-red-600 text-xs">
              <p>💡 대신 다음 형식의 파일을 사용해보세요:</p>
              <ul className="list-disc ml-4 mt-1">
                <li>문서: DOCX, PPTX, XLSX, TXT (PDF로 변환 가능)</li>
                <li>이미지: JPG, PNG, WebP, GIF, BMP</li>
                <li>비디오: MP4, AVI, MOV, WebM</li>
                <li>오디오: MP3, WAV, AAC, FLAC</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnsupportedFileWarning;

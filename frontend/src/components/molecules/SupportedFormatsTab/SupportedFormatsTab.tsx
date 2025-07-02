"use client";

import React from "react";
import FormatCategoryCard from "../FormatCategoryCard/FormatCategoryCard";
import {
  VIDEO_FORMATS,
  AUDIO_FORMATS,
  IMAGE_FORMATS,
  WRITER_FORMATS,
  SPREADSHEET_FORMATS,
  PRESENTATION_FORMATS,
} from "@/constants/convertFormats";

const SupportedFormatsTab: React.FC = () => {
  const supportedCategories = [
    { name: "🎬 비디오", formats: VIDEO_FORMATS },
    { name: "🎵 오디오", formats: AUDIO_FORMATS },
    { name: "🖼️ 이미지", formats: IMAGE_FORMATS },
    { name: "📝 텍스트 문서", formats: WRITER_FORMATS },
    { name: "📊 스프레드시트", formats: SPREADSHEET_FORMATS },
    // 📽️ 프레젠테이션: LibreOffice에서 지원하지 않음 (모든 변환 실패)
    // 📄 PDF: 변환 지원하지 않음 (LibreOffice export filter 없음)
    // 📦 압축: 백엔드에서 지원하지 않음
  ].filter(category => category.formats.length > 0); // 빈 포맷 카테고리 제외

  return (
    <div className="p-6 space-y-6">
      <p className="text-gray-600 mb-4">다음 포맷들 간의 변환을 지원합니다.</p>

      {supportedCategories.map(category => (
        <FormatCategoryCard key={category.name} name={category.name} formats={category.formats} />
      ))}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h4 className="font-semibold text-blue-800 mb-2">💡 변환 예시</h4>
                  <ul className="text-blue-700 space-y-1">
            <li>
              • <strong>비디오:</strong> MP4 → AVI, MOV, WebM, MP3, WAV 등
            </li>
            <li>
              • <strong>문서:</strong> DOCX → PDF, DOC, ODT, RTF, TXT
            </li>
            <li>
              • <strong>스프레드시트:</strong> XLSX → XLS, ODS, CSV, TXT (PDF 제외)
            </li>
            <li>
              • <strong>이미지:</strong> PNG → JPG, WebP, AVIF 등
            </li>
            <li>
              • <strong>오디오:</strong> MP3 → WAV, FLAC, AAC 등
            </li>
          </ul>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
        <h4 className="font-semibold text-yellow-800 mb-2">⚠️ PDF 변환 제한</h4>
        <p className="text-yellow-700">
          <strong>PDF에서 다른 포맷으로의 변환은 지원하지 않습니다.</strong>
          <br />
          PDF는 다른 포맷으로 변환하기 위한 출력 대상으로만 사용할 수 있습니다. (예: DOCX → PDF,
          XLSX → PDF)
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
        <h4 className="font-semibold text-green-800 mb-2">🎯 한글 지원</h4>
        <p className="text-green-700">
          모든 문서 변환에서 한글이 완벽하게 지원됩니다. PDF 변환 시에도 한글이 네모(□)로 표시되지
          않고 정상적으로 보입니다.
        </p>
      </div>
    </div>
  );
};

export default SupportedFormatsTab;

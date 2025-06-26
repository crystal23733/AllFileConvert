"use client";

import React from "react";

const UnsupportedFormatsTab: React.FC = () => {
  const unsupportedTypes = [
    "🚫 Apple 전용 포맷 (.pages, .numbers, .keynote)",
    "🚫 압축 파일 (.zip, .rar, .7z)",
    "🚫 실행 파일 (.exe, .app, .deb)",
    "🚫 시스템 파일 (.dll, .so, .dylib)",
    "🚫 암호화된 파일 (.p7c, .cer)",
    "🚫 데이터베이스 파일 (.sqlite, .mdb)",
    "🚫 폰트 파일 (.ttf, .woff)",
    "🚫 플래시 파일 (.swf)",
  ];

  return (
    <div className="p-6 space-y-4">
      <p className="text-gray-600 mb-4">보안상의 이유로 다음 파일 형식은 지원하지 않습니다:</p>

      <div className="grid gap-3">
        {unsupportedTypes.map((type, index) => (
          <div key={index} className="bg-red-50 border border-red-200 rounded px-4 py-3">
            <span className="text-red-700">{type}</span>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
        <h4 className="font-semibold text-yellow-800 mb-2">⚠️ 주의사항</h4>
        <ul className="text-yellow-700 space-y-1">
          <li>• Apple 포맷은 호환성 문제로 현재 지원하지 않습니다</li>
          <li>• 압축 파일은 내용 확인이 어려워 지원하지 않습니다</li>
          <li>• 실행 파일은 보안상 업로드가 차단됩니다</li>
          <li>• 암호화된 파일은 변환할 수 없습니다</li>
          <li>• 손상된 파일은 변환이 실패할 수 있습니다</li>
          <li>• 파일 크기는 최대 100MB까지 지원합니다</li>
        </ul>
      </div>
    </div>
  );
};

export default UnsupportedFormatsTab; 
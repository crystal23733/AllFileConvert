"use client";

import Dropzone from "@/components/molecules/DropZone/Dropzone";
import { useState } from "react";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = (accepted: File[]) => {
    setFiles(accepted);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-6">DropZone 렌더링 테스트</h1>
      <Dropzone onDrop={handleDrop} />
      {files.length > 0 && (
        <ul className="mt-6">
          {files.map((file, idx) => (
            <li key={idx} className="text-sm text-gray-600">
              {file.name} ({file.size} bytes)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

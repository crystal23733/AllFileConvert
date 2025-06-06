import { FC } from "react";
import DropzoneProps from "./Dropzone.types";
import { useDropzone } from "react-dropzone";

const Dropzone: FC<DropzoneProps> = ({
  onDrop,
  disabled = false,
  accept,
  multiple = false,
  className = "",
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    accept,
    multiple,
  });
  return (
    <div
      {...getRootProps()}
      data-testid="dropzone-root"
      className={
        `w-full p-6 border-2 border-dashed rounded-xl text-center transition
        cursor-pointer outline-none select-none 
        ${isDragActive ? "bg-blue-50 border-blue-400" : "bg-gray-50 border-gray-200"}
        ${disabled ? "opacity-50 pointer-events-none" : ""}
        ` + className
      }
      tabIndex={-1}
    >
      <input {...getInputProps()} aria-label="파일 업로드" data-testid="dropzone-input" />
      <p className="text-gray-500 text-base">
        파일을 끌어오거나 <span className="text-blue-600 underline">클릭</span>해서 선택하세요
      </p>
      <p className="text-xs text-gray-400 mt-1">최대 200MB, mp4/pdf/jpg 등 지원</p>
    </div>
  );
};

export default Dropzone;

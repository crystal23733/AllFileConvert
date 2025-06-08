import { FC } from "react";
import DownloadButtonProps from "./DownloadButton.types";

const DownloadButton: FC<DownloadButtonProps> = ({
  onClick,
  disabled = false,
  className = "",
  label = "파일 다운로드",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`py-2 px-4 rounded bg-green-600 text-white font-semibold shadow
      hover:bg-green-700 active:bg-green-800 transition
      disabled:opacity-50 disabled:cursor-not-allowed w-full ${className}`}
    >
      {label}
    </button>
  );
};

export default DownloadButton;

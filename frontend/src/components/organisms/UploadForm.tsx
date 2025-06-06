import { FC } from "react";
import UploadFormProps from "./UploadForm.types";
import AdArea from "../atoms/AdArea/AdArea";
import Dropzone from "../molecules/DropZone/Dropzone";
import FormatSelect from "../molecules/FormatSelect/FormatSelect";
import Button from "../atoms/Button/Button";

const UploadForm: FC<UploadFormProps> = ({
  onFileDrop,
  selectedFormat,
  onFormatChange,
  onSubmit,
  isSubmitting = false,
  disabled = false,
  formatOptions,
  className = "",
}) => {
  return (
    <form
      className={`space-y-4 max-w-lg mx-auto p-4 bg-white rounded shadow ${className}`}
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <AdArea position="top" />
      <Dropzone onDrop={onFileDrop} disabled={disabled} />
      <FormatSelect
        value={selectedFormat}
        onChange={onFormatChange}
        options={formatOptions}
        disabled={disabled}
      />
      <Button variant="primary" type="submit" disabled={disabled || isSubmitting}>
        {isSubmitting ? "업로드 중…" : "변환 요청"}
      </Button>
      <AdArea position="bottom" />
    </form>
  );
};

export default UploadForm;

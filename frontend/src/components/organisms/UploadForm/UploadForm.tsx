import { FC } from "react";
import { useTranslation } from "react-i18next";
import UploadFormProps from "./UploadForm.types";
import Dropzone from "../../molecules/DropZone/Dropzone";
import FormatSelect from "../../molecules/FormatSelect/FormatSelect";
import Button from "../../atoms/Button/Button";

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
  const { t } = useTranslation();

  return (
    <form
      className={`space-y-4 max-w-lg mx-auto p-4 bg-white rounded shadow ${className}`}
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {/* 파일 드롭존은 항상 활성화 (파일 재선택 허용) */}
      <Dropzone
        onDrop={onFileDrop}
        disabled={isSubmitting} // 업로드 중일 때만 비활성화
      />

      {/* 포맷 선택과 변환 버튼은 disabled 상태에 따라 비활성화 */}
      <FormatSelect
        value={selectedFormat}
        onChange={onFormatChange}
        options={formatOptions}
        disabled={disabled || isSubmitting}
        label={t("upload.format.label")}
      />
      <Button variant="primary" type="submit" disabled={disabled || isSubmitting}>
        {isSubmitting ? t("upload.button.converting") : t("upload.button.convert")}
      </Button>
    </form>
  );
};

export default UploadForm;

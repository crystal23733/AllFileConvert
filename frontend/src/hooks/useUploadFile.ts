import FileService, { FileUploadResponse } from "@/services/FileService";
import { useMutation } from "@tanstack/react-query";

export default () => {
  return useMutation<FileUploadResponse, Error, File>({
    mutationFn: (file: File) => FileService.upload(file),
  });
};

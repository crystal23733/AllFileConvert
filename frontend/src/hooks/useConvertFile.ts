import ConvertService, { ConvertRequest, ConvertResponse } from "@/services/ConvertService";
import { useMutation } from "@tanstack/react-query";

export default () => {
  return useMutation<ConvertResponse, Error, ConvertRequest>({
    mutationFn: (req: ConvertRequest) => ConvertService.convert(req),
  });
};

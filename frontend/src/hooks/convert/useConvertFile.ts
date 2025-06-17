import ConvertService, { ConvertRequest, ConvertResponse } from "@/services/convert/ConvertService";
import { useMutation } from "@tanstack/react-query";

export default () => {
  return useMutation<ConvertResponse, Error, ConvertRequest>({
    mutationFn: (req: ConvertRequest) => ConvertService.convert(req),
  });
};

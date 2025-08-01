jest.mock("axios", () => ({
  post: jest.fn(),
}));

import axios from "axios";
import FileService from "../FileService";

describe("FileService", () => {
  const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost";

  it("파일 업로드 요청 시 file_id를 반환한다", async () => {
    const dummyFile = new File(["hello"], "hello.txt", { type: "text/plain" });

    (axios.post as jest.Mock).mockResolvedValue({
      data: { file_id: "abc123" },
    });

    const result = await FileService.upload(dummyFile);

    expect(axios.post).toHaveBeenCalledWith(
      `${apiBaseURL}/upload`,
      expect.any(FormData),
      expect.objectContaining({ headers: { "Content-Type": "multipart/form-data" } })
    );
    expect(result).toEqual({ file_id: "abc123" });
  });
});

import axios from "axios";
import ConvertStatusService, { ConvertStatusResponse } from "../ConvertStatusService";

// jest.mock()으로 axios를 모킹
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ConvertStatusService", () => {
  const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("성공적으로 변환 상태를 받아온다", async () => {
    const mockResponse: ConvertStatusResponse = {
      status: "completed",
      download_url: "/files/abc.mp4",
    };
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const result = await ConvertStatusService.getStatus("123");
    expect(result.status).toBe("completed");
    expect(result.download_url).toBe("/files/abc.mp4");
    expect(mockedAxios.get).toHaveBeenCalledWith(`${apiBaseURL}/convert/status/123`);
  });

  it("변환 상태 요청이 실패하면 예외가 발생한다", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("API 에러"));

    await expect(ConvertStatusService.getStatus("fail-id")).rejects.toThrow("API 에러");
  });
});

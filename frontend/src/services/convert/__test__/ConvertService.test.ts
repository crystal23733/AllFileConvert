import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import ConvertService, { ConvertRequest, ConvertResponse } from "../ConvertService";

describe("ConvertService", () => {
  const mock = new MockAdapter(axios);
  const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost";

  afterEach(() => {
    mock.reset();
  });

  it("변환 요청을 보내고 conversion_id를 수신", async () => {
    const request: ConvertRequest = { file_id: "abc123", target_format: "mp4" };
    const response: ConvertResponse = { conversion_id: "xyz789" };

    mock.onPost(`${apiBaseURL}/convert`, request).reply(200, response);

    const result = await ConvertService.convert(request);

    expect(result).toEqual(response);
  });

  it("HTTP 오류 발생", async () => {
    const request: ConvertRequest = { file_id: "fail", target_format: "mp4" };
    mock.onPost(`${apiBaseURL}/convert`, request).reply(500);

    await expect(ConvertService.convert(request)).rejects.toThrow();
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import FormatSelect from "../FormatSelect";

describe("FormatSelect", () => {
  const options = [
    { value: "mp4", label: "MP4(동영상)" },
    { value: "pdf", label: "PDF(문서)" },
    { value: "jpg", label: "JPG(이미지)" },
  ];

  it("라벨이 표시된다", () => {
    render(
      <FormatSelect
        value="mp4"
        onChange={() => {}}
        options={options}
        label="변환 포맷"
        id="test-format-select"
      />
    );
    expect(screen.getByLabelText("변환 포맷")).toBeInTheDocument();
  });

  it("선택된 값이 표시된다", () => {
    render(
      <FormatSelect
        value="pdf"
        onChange={() => {}}
        options={options}
        label="변환 포맷"
        id="test-format-select"
      />
    );
    const select = screen.getByLabelText("변환 포맷") as HTMLSelectElement;
    expect(select.value).toBe("pdf");
  });

  it("옵션 변경 시 onChange가 호출된다", () => {
    const onChange = jest.fn();
    render(
      <FormatSelect
        value="mp4"
        onChange={onChange}
        options={options}
        label="변환 포맷"
        id="test-format-select"
      />
    );
    const select = screen.getByLabelText("변환 포맷");
    fireEvent.change(select, { target: { value: "jpg" } });
    expect(onChange).toHaveBeenCalledWith("jpg");
  });
});

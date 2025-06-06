import { render, screen, fireEvent } from "@testing-library/react";
import UploadForm from "../UploadForm";

describe("UploadForm", () => {
  const formatOptions = [
    { value: "mp4", label: "MP4(동영상)" },
    { value: "pdf", label: "PDF(문서)" },
    { value: "jpg", label: "JPG(이미지)" },
  ];

  const mockDrop = jest.fn();
  const mockFormatChange = jest.fn();
  const mockSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all UI elements", () => {
    render(
      <UploadForm
        onFileDrop={mockDrop}
        selectedFormat="mp4"
        onFormatChange={mockFormatChange}
        onSubmit={mockSubmit}
        formatOptions={formatOptions}
      />
    );
    expect(screen.getByText(/변환 요청/)).toBeInTheDocument();
    expect(screen.getByText(/파일을 끌어오거나/i)).toBeInTheDocument();
  });

  it("calls onSubmit when form is submitted", () => {
    render(
      <UploadForm
        onFileDrop={mockDrop}
        selectedFormat="mp4"
        onFormatChange={mockFormatChange}
        onSubmit={mockSubmit}
        formatOptions={formatOptions}
      />
    );
    const button = screen.getByRole("button", { name: /변환 요청/i });
    fireEvent.click(button);
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });

  it("calls onFormatChange when select changes", () => {
    render(
      <UploadForm
        onFileDrop={mockDrop}
        selectedFormat="mp4"
        onFormatChange={mockFormatChange}
        onSubmit={mockSubmit}
        formatOptions={formatOptions}
      />
    );
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "pdf" } });
    expect(mockFormatChange).toHaveBeenCalledWith("pdf");
  });

  it("submit button is disabled during submitting", () => {
    render(
      <UploadForm
        onFileDrop={mockDrop}
        selectedFormat="mp4"
        onFormatChange={mockFormatChange}
        onSubmit={mockSubmit}
        isSubmitting={true}
        formatOptions={formatOptions}
      />
    );
    const button = screen.getByRole("button", { name: /업로드 중/i });
    expect(button).toBeDisabled();
  });
});

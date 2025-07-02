import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import UnsupportedFileWarning from "../UnsupportedFileWarning";

describe("UnsupportedFileWarning", () => {
  const defaultProps = {
    fileName: "test-file.pages",
    mimeType: "application/vnd.apple.pages",
  };

  it("올바르게 렌더링된다", () => {
    render(<UnsupportedFileWarning {...defaultProps} />);

    expect(screen.getByText("지원하지 않는 파일 형식")).toBeInTheDocument();
    expect(screen.getByText(/test-file.pages/)).toBeInTheDocument();
  });

  it("Apple 포맷에 대한 올바른 메시지를 표시한다", () => {
    render(<UnsupportedFileWarning {...defaultProps} />);

    expect(screen.getByText(/Apple 전용 포맷/)).toBeInTheDocument();
    expect(screen.getByText(/현재 변환을 지원하지 않습니다/)).toBeInTheDocument();
  });

  it("실행 파일에 대한 올바른 메시지를 표시한다", () => {
    render(<UnsupportedFileWarning fileName="program.exe" mimeType="application/x-msdownload" />);

    expect(screen.getByText(/실행 파일/)).toBeInTheDocument();
  });

  it("일반적인 지원하지 않는 파일에 대한 기본 메시지를 표시한다", () => {
    render(<UnsupportedFileWarning fileName="unknown.xyz" mimeType="application/unknown" />);

    expect(screen.getByText("지원하지 않는 파일 형식")).toBeInTheDocument();
  });

  it("대안 포맷 제안을 표시한다", () => {
    render(<UnsupportedFileWarning {...defaultProps} />);

    expect(screen.getByText(/대신 다음 형식의 파일을 사용해보세요/)).toBeInTheDocument();
    expect(screen.getByText(/문서: PDF, DOCX, PPTX, XLSX, TXT/)).toBeInTheDocument();
    expect(screen.getByText(/이미지: JPG, PNG, WebP, GIF, BMP/)).toBeInTheDocument();
    expect(screen.getByText(/비디오: MP4, AVI, MOV, WebM/)).toBeInTheDocument();
    expect(screen.getByText(/오디오: MP3, WAV, AAC, FLAC/)).toBeInTheDocument();
  });

  it("커스텀 className을 적용한다", () => {
    const { container } = render(
      <UnsupportedFileWarning {...defaultProps} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("경고 아이콘을 표시한다", () => {
    render(<UnsupportedFileWarning {...defaultProps} />);

    expect(screen.getByText("⚠️")).toBeInTheDocument();
  });
});

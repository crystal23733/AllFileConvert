import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SupportedFormatsTab from "../SupportedFormatsTab";

// FormatCategoryCard 컴포넌트 모킹
jest.mock("../../FormatCategoryCard/FormatCategoryCard", () => {
  return function MockFormatCategoryCard({
    name,
    formats,
  }: {
    name: string;
    formats: { value: string; label: string }[];
  }) {
    return (
      <div data-testid="format-category-card">
        <h3>{name}</h3>
        <div>
          {formats.map((format: { value: string; label: string }) => (
            <span key={format.value}>{format.label}</span>
          ))}
        </div>
      </div>
    );
  };
});

describe("SupportedFormatsTab", () => {
  it("올바르게 렌더링된다", () => {
    render(<SupportedFormatsTab />);

    expect(screen.getByText(/다음 포맷들 간의 변환을 지원합니다/)).toBeInTheDocument();
  });

  it("모든 포맷 카테고리를 표시한다", () => {
    render(<SupportedFormatsTab />);

    expect(screen.getByText("🎬 비디오")).toBeInTheDocument();
    expect(screen.getByText("🎵 오디오")).toBeInTheDocument();
    expect(screen.getByText("🖼️ 이미지")).toBeInTheDocument();
    expect(screen.getByText("📝 텍스트 문서")).toBeInTheDocument();
    expect(screen.getByText("📊 스프레드시트")).toBeInTheDocument();
  });

  it("FormatCategoryCard 컴포넌트들이 렌더링된다", () => {
    render(<SupportedFormatsTab />);

    const categoryCards = screen.getAllByTestId("format-category-card");
    expect(categoryCards).toHaveLength(5); // 5개 카테고리
  });

  it("변환 예시 섹션을 표시한다", () => {
    render(<SupportedFormatsTab />);

    expect(screen.getByText("💡 변환 예시")).toBeInTheDocument();
    expect(screen.getByText(/MP4 → AVI, MOV, WebM, MP3, WAV 등/)).toBeInTheDocument();
    expect(screen.getByText(/DOCX → PDF, DOC, ODT, RTF, TXT/)).toBeInTheDocument();
    expect(screen.getByText(/XLSX → XLS, ODS, CSV, TXT \(PDF 제외\)/)).toBeInTheDocument();
    expect(screen.getByText(/PNG → JPG, WebP, AVIF 등/)).toBeInTheDocument();
    expect(screen.getByText(/MP3 → WAV, FLAC, AAC 등/)).toBeInTheDocument();
  });

  it("PDF 변환 제한 경고를 표시한다", () => {
    render(<SupportedFormatsTab />);

    expect(screen.getByText("⚠️ PDF 변환 제한")).toBeInTheDocument();
    expect(
      screen.getByText(/PDF에서 다른 포맷으로의 변환은 지원하지 않습니다/)
    ).toBeInTheDocument();
  });

  it("한글 지원 안내를 표시한다", () => {
    render(<SupportedFormatsTab />);

    expect(screen.getByText("🎯 한글 지원")).toBeInTheDocument();
    expect(screen.getByText(/모든 문서 변환에서 한글이 완벽하게 지원됩니다/)).toBeInTheDocument();
  });

  it("올바른 CSS 클래스가 적용된다", () => {
    const { container } = render(<SupportedFormatsTab />);

    expect(container.firstChild).toHaveClass("p-6", "space-y-6");
  });

  it("변환 예시가 파란색 배경으로 강조된다", () => {
    render(<SupportedFormatsTab />);

    const exampleSection = screen.getByText("💡 변환 예시").parentElement;
    expect(exampleSection).toHaveClass("bg-blue-50", "border-blue-200");
  });
});

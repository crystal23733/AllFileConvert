import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import UnsupportedFormatsTab from "../UnsupportedFormatsTab";

describe("UnsupportedFormatsTab", () => {
  it("올바르게 렌더링된다", () => {
    render(<UnsupportedFormatsTab />);

    expect(
      screen.getByText(/보안상의 이유로 다음 파일 형식은 지원하지 않습니다/)
    ).toBeInTheDocument();
  });

  it("모든 지원하지 않는 포맷 타입을 표시한다", () => {
    render(<UnsupportedFormatsTab />);

    expect(screen.getByText("🚫 Apple 전용 포맷 (.pages, .numbers, .keynote)")).toBeInTheDocument();
    expect(screen.getByText("🚫 압축 파일 (.zip, .rar, .7z)")).toBeInTheDocument();
    expect(screen.getByText("🚫 실행 파일 (.exe, .app, .deb)")).toBeInTheDocument();
    expect(screen.getByText("🚫 시스템 파일 (.dll, .so, .dylib)")).toBeInTheDocument();
    expect(screen.getByText("🚫 암호화된 파일 (.p7c, .cer)")).toBeInTheDocument();
    expect(screen.getByText("🚫 데이터베이스 파일 (.sqlite, .mdb)")).toBeInTheDocument();
    expect(screen.getByText("🚫 폰트 파일 (.ttf, .woff)")).toBeInTheDocument();
    expect(screen.getByText("🚫 플래시 파일 (.swf)")).toBeInTheDocument();
  });

  it("주의사항 섹션을 표시한다", () => {
    render(<UnsupportedFormatsTab />);

    expect(screen.getByText("⚠️ 주의사항")).toBeInTheDocument();
    expect(
      screen.getByText(/Apple 포맷은 호환성 문제로 현재 지원하지 않습니다/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/압축 파일은 내용 확인이 어려워 지원하지 않습니다/)
    ).toBeInTheDocument();
    expect(screen.getByText(/실행 파일은 보안상 업로드가 차단됩니다/)).toBeInTheDocument();
    expect(screen.getByText(/파일 크기는 최대 100MB까지 지원합니다/)).toBeInTheDocument();
  });

  it("지원하지 않는 포맷들이 빨간색 배경으로 표시된다", () => {
    render(<UnsupportedFormatsTab />);

    const appleFormatItem = screen.getByText(/Apple 전용 포맷/).parentElement;
    expect(appleFormatItem).toHaveClass("bg-red-50", "border-red-200");
  });

  it("주의사항이 노란색 배경으로 강조된다", () => {
    render(<UnsupportedFormatsTab />);

    const warningSection = screen.getByText("⚠️ 주의사항").parentElement;
    expect(warningSection).toHaveClass("bg-yellow-50", "border-yellow-200");
  });

  it("올바른 CSS 클래스가 적용된다", () => {
    const { container } = render(<UnsupportedFormatsTab />);

    expect(container.firstChild).toHaveClass("p-6", "space-y-4");
  });

  it("모든 지원하지 않는 항목이 그리드로 표시된다", () => {
    render(<UnsupportedFormatsTab />);

    const gridContainer = screen.getByText(/Apple 전용 포맷/).parentElement?.parentElement;
    expect(gridContainer).toHaveClass("grid", "gap-3");
  });
});

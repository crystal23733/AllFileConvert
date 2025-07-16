import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FormatCategoryCard from "../FormatCategoryCard";

describe("FormatCategoryCard", () => {
  const defaultProps = {
    name: "🎬 비디오",
    formats: [
      { value: "mp4", label: "MP4" },
      { value: "avi", label: "AVI" },
      { value: "mov", label: "MOV" },
    ],
  };

  it("올바르게 렌더링된다", () => {
    render(<FormatCategoryCard {...defaultProps} />);

    expect(screen.getByText("🎬 비디오")).toBeInTheDocument();
    expect(screen.getByText("MP4")).toBeInTheDocument();
    expect(screen.getByText("AVI")).toBeInTheDocument();
    expect(screen.getByText("MOV")).toBeInTheDocument();
  });

  it("모든 포맷이 표시된다", () => {
    render(<FormatCategoryCard {...defaultProps} />);

    defaultProps.formats.forEach(format => {
      expect(screen.getByText(format.label)).toBeInTheDocument();
    });
  });

  it("빈 포맷 배열을 처리한다", () => {
    render(<FormatCategoryCard name="빈 카테고리" formats={[]} />);

    expect(screen.getByText("빈 카테고리")).toBeInTheDocument();
    expect(screen.queryByText("MP4")).not.toBeInTheDocument();
  });

  it("커스텀 className을 적용한다", () => {
    const { container } = render(<FormatCategoryCard {...defaultProps} className="custom-class" />);

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("포맷 항목들이 그리드 레이아웃으로 표시된다", () => {
    render(<FormatCategoryCard {...defaultProps} />);

    const gridContainer = screen.getByText("MP4").parentElement?.parentElement;
    expect(gridContainer).toHaveClass(
      "grid",
      "grid-cols-2",
      "md:grid-cols-3",
      "lg:grid-cols-4",
      "gap-2"
    );
  });

  it("각 포맷 항목에 올바른 스타일이 적용된다", () => {
    render(<FormatCategoryCard {...defaultProps} />);

    const formatItem = screen.getByText("MP4").parentElement;
    expect(formatItem).toHaveClass("bg-green-50", "border-green-200");
  });
});

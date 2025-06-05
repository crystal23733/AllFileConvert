import { render, screen } from "@testing-library/react";
import ProgressBarWithLabel from "../ProgressBarWithLabel";

describe("ProgressBarWithLabel", () => {
  it("대기 중 상태를 올바르게 표시", () => {
    render(<ProgressBarWithLabel status="pending" />);
    expect(screen.getByText(/대기 중/i)).toBeInTheDocument();
    // 프로그레스바의 width 스타일 확인
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveStyle({ width: "0%" });
  });

  it("변환 중 상태를 올바르게 표시", () => {
    render(<ProgressBarWithLabel status="processing" />);
    expect(screen.getByText(/진행 중.../i)).toBeInTheDocument();
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveStyle({ width: "50%" });
  });

  it("완료 상태를 올바르게 표시", () => {
    render(<ProgressBarWithLabel status="completed" />);
    expect(screen.getByText(/완료 되었습니다./i)).toBeInTheDocument();
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveStyle({ width: "100%" });
  });

  it("실패 상태를 올바르게 표시", () => {
    render(<ProgressBarWithLabel status="failed" />);
    expect(screen.getByText(/변환을 실패하였습니다./i)).toBeInTheDocument();
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveStyle({ width: "100%" });
  });
});

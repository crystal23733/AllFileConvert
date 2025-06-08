import { render, screen, fireEvent } from "@testing-library/react";
import NotFoundPage from "../NotFoundPage";

describe("NotFoundPage", () => {
  it("404 텍스트가 보인다", () => {
    render(<NotFoundPage />);
    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(screen.getByText(/페이지를 찾을 수 없습니다/i)).toBeInTheDocument();
  });

  it("홈으로 돌아가기 버튼이 보인다", () => {
    render(<NotFoundPage />);
    expect(screen.getByRole("button", { name: /홈으로 돌아가기/i })).toBeInTheDocument();
  });

  it("버튼 클릭 시 onGoHome 콜백이 호출된다", () => {
    const handleGoHome = jest.fn();
    render(<NotFoundPage onGoHome={handleGoHome} />);
    const button = screen.getByRole("button", { name: /홈으로 돌아가기/i });
    fireEvent.click(button);
    expect(handleGoHome).toHaveBeenCalledTimes(1);
  });
});

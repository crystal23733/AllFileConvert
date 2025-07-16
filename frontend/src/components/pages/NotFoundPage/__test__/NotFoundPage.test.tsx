import { render, screen, fireEvent } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18nForTests";
import NotFoundPage from "../NotFoundPage";

describe("NotFoundPage", () => {
  const renderWithI18n = (ui: React.ReactElement) => {
    return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
  };

  it("404 텍스트가 보인다", () => {
    renderWithI18n(<NotFoundPage />);
    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(screen.getByText(/페이지를 찾을 수 없습니다/i)).toBeInTheDocument();
  });

  it("홈으로 돌아가기 버튼이 보인다", () => {
    renderWithI18n(<NotFoundPage />);
    expect(screen.getByRole("button", { name: /홈으로 돌아가기/i })).toBeInTheDocument();
  });

  it("버튼 클릭 시 onGoHome 콜백이 호출된다", () => {
    const handleGoHome = jest.fn();
    renderWithI18n(<NotFoundPage onGoHome={handleGoHome} />);
    const button = screen.getByRole("button", { name: /홈으로 돌아가기/i });
    fireEvent.click(button);
    expect(handleGoHome).toHaveBeenCalledTimes(1);
  });
});

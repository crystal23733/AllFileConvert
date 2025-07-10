import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18nForTests";
import ErrorBoundary from "../ErrorBoundary";

// 의도적으로 에러를 발생시키는 컴포넌트
const ThrowError = () => {
  throw new Error("테스트 에러");
};

describe("ErrorBoundary", () => {
  const renderWithI18n = (ui: React.ReactElement) => {
    return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
  };

  it("children이 정상적으로 렌더링된다", () => {
    renderWithI18n(
      <ErrorBoundary>
        <div>정상!</div>
      </ErrorBoundary>
    );
    expect(screen.getByText("정상!")).toBeInTheDocument();
  });

  it("하위 컴포넌트 에러 발생 시 fallback UI가 렌더링된다", () => {
    renderWithI18n(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText("알 수 없는 오류가 발생했습니다.")).toBeInTheDocument();
    expect(
      screen.getByText("페이지를 새로고침하거나 관리자에게 문의해주세요.")
    ).toBeInTheDocument();
  });

  it("fallback 프롭 전달 시 커스텀 UI가 렌더링된다", () => {
    renderWithI18n(
      <ErrorBoundary fallback={<div>커스텀 에러!</div>}>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText("커스텀 에러!")).toBeInTheDocument();
  });
});

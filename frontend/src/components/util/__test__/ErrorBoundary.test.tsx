import { render, screen } from "@testing-library/react";
import ErrorBoundary from "../ErrorBoundary";

const ThrowError: React.FC = () => {
  throw new Error("테스트 에러");
};

describe("ErrorBoundary", () => {
  it("children이 정상적으로 렌더링된다", () => {
    render(
      <ErrorBoundary>
        <div>정상!</div>
      </ErrorBoundary>
    );
    expect(screen.getByText("정상!")).toBeInTheDocument();
  });

  it("하위 컴포넌트 에러 발생 시 fallback UI가 렌더링된다", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText("알 수 없는 오류가 발생했습니다.")).toBeInTheDocument();
    expect(screen.getByText("테스트 에러")).toBeInTheDocument();
  });

  it("fallback 프롭 전달 시 커스텀 UI가 렌더링된다", () => {
    render(
      <ErrorBoundary fallback={<div>커스텀 에러!</div>}>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText("커스텀 에러!")).toBeInTheDocument();
  });
});

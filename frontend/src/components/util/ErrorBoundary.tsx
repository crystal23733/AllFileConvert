import { Component, ErrorInfo, ReactNode } from "react";

/**
 * 하위 트리 컴포넌트에서 발생한 JavaScript 오류를 잡아서, 전체 앱이 죽지 않게 fallback UI로 대체 렌더링
 * @property {ReactNode} children - 감싸고자 하는 하위 컴포넌트 트리
 * @property {ReactNode} fallback - 에러 발생 시 대신 보여줄 UI (기본 값: 간단한 에러 메시지)
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * 컴포넌트의 상태 구조
 * @property {boolean} hasError - 하위 트리에서 에러가 발생했는지 여부
 * @property {Error | null} error - 실제로 발생한 오류 객체 (없으면 null)
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 콘솔/로깅 처리 등 추가 가능
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("ErrorBoundary caught an error", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="p-8 text-center text-red-600">
            <div className="text-xl mb-2 font-bold">알 수 없는 오류가 발생했습니다.</div>
            <div className="text-sm text-gray-500">{this.state.error?.message}</div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

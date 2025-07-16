import { fireEvent, render, screen } from "@testing-library/react";
import StatusPanel from "../StatusPanel";

describe("StatusPanel", () => {
  it("idle 상태일 때 안내 문구가 보임", () => {
    render(<StatusPanel status="idle" />);
    expect(screen.getByText(/파일을 업로드해 주세요/i)).toBeInTheDocument();
  });

  it("pending 상태일 때 진행중 메시지와 스피너가 보임", () => {
    render(<StatusPanel status="pending" />);
    expect(screen.getByText(/변환이 진행 중입니다/i)).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("processing 상태일 때 스피너와 진행중 메시지", () => {
    render(<StatusPanel status="processing" />);
    expect(screen.getByText(/변환이 진행 중입니다/i)).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("completed 상태일 때 다운로드 버튼 표시", () => {
    const mockDownload = jest.fn();
    render(
      <StatusPanel
        status="completed"
        downloadUrl="https://test.com/file.mp4"
        onDownload={mockDownload}
      />
    );
    expect(screen.getByText(/변환이 완료되었습니다/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /다운로드/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /다운로드/i }));
    expect(mockDownload).toHaveBeenCalled();
  });

  it("failed 상태일 때 에러 메시지 표시", () => {
    render(<StatusPanel status="failed" error="포맷 오류" />);
    expect(screen.getByText(/변환에 실패했습니다/i)).toBeInTheDocument();
    expect(screen.getByText(/포맷 오류/i)).toBeInTheDocument();
  });
});

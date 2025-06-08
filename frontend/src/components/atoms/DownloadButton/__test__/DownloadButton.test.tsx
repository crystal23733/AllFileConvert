import { fireEvent, render, screen } from "@testing-library/react";
import DownloadButton from "../DownloadButton";

describe("DownloadButton", () => {
  it("렌더링 및 기본 라벨 표시", () => {
    render(<DownloadButton onClick={() => {}} />);
    expect(screen.getByRole("button", { name: /파일 다운로드/i })).toBeInTheDocument();
  });

  it("커스텀 라벨도 표시된다.", () => {
    render(<DownloadButton onClick={() => {}} label="내려받기" />);
    expect(screen.getByRole("button", { name: "내려받기" })).toBeInTheDocument();
  });

  it("onClick이 정상적으로 동작한다", () => {
    const onClick = jest.fn();
    render(<DownloadButton onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disabled가 true면 클릭해도 동작하지 않는다", () => {
    const onClick = jest.fn();
    render(<DownloadButton onClick={onClick} disabled />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});

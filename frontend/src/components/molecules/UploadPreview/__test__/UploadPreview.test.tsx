import { fireEvent, render, screen } from "@testing-library/react";
import UploadPreview from "../UploadPreview";

describe("UploadPreview", () => {
  const files = [
    { name: "cat.mp4", size: 10_240_000, type: "video/mp4" },
    { name: "dog.jpg", size: 800_000, type: "image/jpeg" },
  ];

  it("업로드된 파일 리스트를 모두 표시한다", () => {
    render(<UploadPreview files={files} />);
    expect(screen.getByText("cat.mp4")).toBeInTheDocument();
    expect(screen.getByText("dog.jpg")).toBeInTheDocument();
    expect(screen.getByText(/MB/)).toBeInTheDocument();
  });

  it("onRemove가 주어지면 삭제 버튼이 나타나고 클릭 시 콜백된다", () => {
    const handleRemove = jest.fn();
    render(<UploadPreview files={files} onRemove={handleRemove} />);
    // 두 개의 삭제 버튼 존재
    const buttons = screen.getAllByText("삭제");
    expect(buttons.length).toBe(2);
    // 첫 번째 삭제 버튼 클릭
    fireEvent.click(buttons[0]);
    expect(handleRemove).toHaveBeenCalledWith(0);
  });

  it("업로드 파일이 없으면 아무것도 렌더링하지 않는다", () => {
    const { container } = render(<UploadPreview files={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

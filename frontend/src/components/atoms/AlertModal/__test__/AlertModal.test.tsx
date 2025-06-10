import { fireEvent, render, screen } from "@testing-library/react";
import AlertModal from "../AlertModal";

describe("AlertModal", () => {
  it("열렸을 때 메시지와 버튼이 보인다", () => {
    render(<AlertModal open={true} message="테스트 메세지" onClose={() => {}} />);
    expect(screen.getByText("테스트 메세지")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "확인" })).toBeInTheDocument();
  });

  it("닫혀있으면 아무것도 렌더링하지 않는다", () => {
    render(<AlertModal open={false} message="숨김" onClose={() => {}} />);
    expect(screen.queryByText("숨김")).not.toBeInTheDocument();
  });

  it("confirmLabel이 커스텀 라벨로 변경된다", () => {
    render(<AlertModal open={true} message="라벨 테스트" confirmLabel="OK" onClose={() => {}} />);
    expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
  });

  it("확인 버튼 클릭 시 onClose가 호출된다", () => {
    const mockClose = jest.fn();
    render(<AlertModal open={true} message="메세지" onClose={mockClose} />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockClose).toHaveBeenCalled();
  });
});

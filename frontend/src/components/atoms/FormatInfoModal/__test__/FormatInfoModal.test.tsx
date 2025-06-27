import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FormatInfoModal from "../FormatInfoModal";

describe("FormatInfoModal", () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    children: <div>테스트 내용</div>,
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it("모달이 열려있을 때 올바르게 렌더링된다", () => {
    render(<FormatInfoModal {...defaultProps} />);

    expect(screen.getByText("지원 포맷 정보")).toBeInTheDocument();
    expect(screen.getByText("테스트 내용")).toBeInTheDocument();
  });

  it("모달이 닫혀있을 때 렌더링되지 않는다", () => {
    render(<FormatInfoModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText("지원 포맷 정보")).not.toBeInTheDocument();
    expect(screen.queryByText("테스트 내용")).not.toBeInTheDocument();
  });

  it("닫기 버튼 클릭시 onClose가 호출된다", () => {
    render(<FormatInfoModal {...defaultProps} />);

    const closeButton = screen.getByText("×");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("백드롭 클릭시 onClose가 호출된다", () => {
    render(<FormatInfoModal {...defaultProps} />);

    const backdrop = screen.getByRole("dialog").parentElement?.firstChild;
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it("모달 내용 영역 클릭시 onClose가 호출되지 않는다", () => {
    render(<FormatInfoModal {...defaultProps} />);

    const modalContent = screen.getByText("지원 포맷 정보").closest("div");
    if (modalContent) {
      fireEvent.click(modalContent);
      expect(mockOnClose).not.toHaveBeenCalled();
    }
  });

  it("children이 올바르게 렌더링된다", () => {
    const customChildren = (
      <div>
        <p>커스텀 내용 1</p>
        <p>커스텀 내용 2</p>
      </div>
    );

    render(<FormatInfoModal {...defaultProps}>{customChildren}</FormatInfoModal>);

    expect(screen.getByText("커스텀 내용 1")).toBeInTheDocument();
    expect(screen.getByText("커스텀 내용 2")).toBeInTheDocument();
  });
});

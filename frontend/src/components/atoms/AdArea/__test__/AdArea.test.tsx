import { render, screen } from "@testing-library/react";
import AdArea from "../AdArea";

describe("AdArea", () => {
  it("상단 렌더링 테스트", () => {
    render(<AdArea position="top" />);
    const adArea = screen.getByRole("complementary");
    expect(adArea).toHaveClass("w-full", "min-h-[70px]", "mb-4");
    expect(adArea).toBeVisible();
  });
  it("renders the left ad area as hidden on mobile", () => {
    render(<AdArea position="left" />);
    const adArea = screen.getByRole("complementary");
    // lg:flex만 표시, hidden(모바일) 포함
    expect(adArea).toHaveClass("hidden", "lg:flex", "fixed", "left-0");
  });

  it("renders the bottom ad area with correct styles", () => {
    render(<AdArea position="bottom" />);
    const adArea = screen.getByRole("complementary");
    expect(adArea).toHaveClass("w-full", "min-h-[60px]", "mt-4");
  });

  it("allows custom className to be merged", () => {
    render(<AdArea position="top" className="custom-ad" />);
    const adArea = screen.getByRole("complementary");
    expect(adArea).toHaveClass("custom-ad");
  });
});

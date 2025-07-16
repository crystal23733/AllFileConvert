import { render, screen } from "@testing-library/react";
import ProgressBar from "../ProgressBar";

describe("ProgressBar", () => {
  it("renders gray bar at 0% for pending", () => {
    render(<ProgressBar status="pending" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveStyle("width: 0%");
    expect(bar).toHaveClass("bg-gray-300");
  });

  it("renders blue bar at 50% for processing", () => {
    render(<ProgressBar status="processing" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveStyle("width: 50%");
    expect(bar).toHaveClass("bg-blue-400");
  });

  it("renders green bar at 100% for completed", () => {
    render(<ProgressBar status="completed" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveStyle("width: 100%");
    expect(bar).toHaveClass("bg-green-500");
  });

  it("renders red bar at 100% for failed", () => {
    render(<ProgressBar status="failed" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveStyle("width: 100%");
    expect(bar).toHaveClass("bg-red-500");
  });
});

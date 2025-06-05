import Button from "../Button";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";

describe("Button", () => {
  it("버튼에 텍스트가 표시된다", () => {
    render(<Button variant="primary">버튼!</Button>);
    expect(screen.getByText("버튼!"));
  });
});

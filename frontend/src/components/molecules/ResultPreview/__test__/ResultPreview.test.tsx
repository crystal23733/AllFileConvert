import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18nForTests";
import ResultPreview from "../ResultPreview";

jest.mock("../../../atoms/Typography/Typography", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

describe("ResultPreview", () => {
  const url = "https://example.com/testfile";
  const fileName = "example.jpg";

  const renderWithI18n = (ui: React.ReactElement) => {
    return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
  };

  it("이미지 타입이면 <img> 렌더링", () => {
    renderWithI18n(<ResultPreview url={url} type="image" filename={fileName} />);
    const img = screen.getByAltText(fileName);
    expect(img).toBeInTheDocument();
    expect(img.tagName).toBe("IMG");
    expect(img.getAttribute("src")).toContain(encodeURIComponent(url));
  });

  it("비디오 타입이면 <video> 렌더링", () => {
    renderWithI18n(<ResultPreview url={url} type="video" filename={fileName} />);
    const videos = document.querySelectorAll("video");
    expect(videos.length).toBe(1);
    expect(videos[0]).toHaveAttribute("src", url);
  });

  it("PDF 타입이면 <iframe> 렌더링", () => {
    renderWithI18n(<ResultPreview url={url} type="pdf" filename={fileName} />);
    const iframe = screen.getByTitle(/PDF 미리보기|example\.jpg/);
    expect(iframe).toBeInTheDocument();
    expect(iframe.tagName).toBe("IFRAME");
    expect(iframe).toHaveAttribute("src", url);
  });

  it("미지원 타입이면 안내 메시지 렌더링", () => {
    renderWithI18n(<ResultPreview url={url} type="unknown" filename={fileName} />);
    expect(screen.getByText("미리보기를 지원하지 않는 파일 유형입니다.")).toBeInTheDocument();
  });

  it("url이 없으면 아무것도 렌더링하지 않는다", () => {
    const { container } = renderWithI18n(<ResultPreview url="" type="image" />);
    expect(container).toBeEmptyDOMElement();
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import LanguageSwitcher from "../LanguageSwitcher";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18nForTests";

describe("LanguageSwitcher", () => {
  it("언어 텍스트가 모두 렌더링 되는지 확인", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSwitcher />
      </I18nextProvider>
    );
    // 각 언어 옵션이 보이는지 확인
    expect(screen.getByText("한국어")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("日本語")).toBeInTheDocument();
  });

  it("선택 항목이 변경되면 i18n.changeLanguage 호출", () => {
    // changeLanguage를 spy 처리
    const spy = jest.spyOn(i18n, "changeLanguage");
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSwitcher />
      </I18nextProvider>
    );
    const select = screen.getByLabelText("언어 선택") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "ja" } });
    expect(spy).toHaveBeenCalledWith("ja");
    fireEvent.change(select, { target: { value: "en" } });
    expect(spy).toHaveBeenCalledWith("en");
    spy.mockRestore();
  });
});

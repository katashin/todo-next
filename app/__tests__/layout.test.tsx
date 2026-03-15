import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// next/font/google をモック
vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans", className: "font-geist-sans" }),
  Geist_Mono: () => ({ variable: "--font-geist-mono", className: "font-geist-mono" }),
}));

// 動的インポートが必要なため layout をモック後に読み込む
const { default: RootLayout } = await import("../layout");

describe("RootLayout", () => {
  it("children が描画される", () => {
    render(
      <RootLayout>
        <div>テストコンテンツ</div>
      </RootLayout>
    );
    expect(screen.getByText("テストコンテンツ")).toBeInTheDocument();
  });
});

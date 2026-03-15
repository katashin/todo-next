import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TodoApp from "../TodoApp";

// next/dynamic をモックして TodoApp を同期的に返す
vi.mock("next/dynamic", () => ({
  default: () => TodoApp,
}));

const { default: Page } = await import("../page");

describe("Page", () => {
  it("ページが描画される", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: "TODO" })).toBeInTheDocument();
  });

  it("TodoApp コンポーネントが含まれる", () => {
    render(<Page />);
    expect(screen.getByPlaceholderText("新しいタスクを入力...")).toBeInTheDocument();
  });
});

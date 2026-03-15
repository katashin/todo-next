import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoApp from "../TodoApp";

describe("TodoApp", () => {
  describe("初期表示", () => {
    it("タイトル「TODO」が表示される", () => {
      render(<TodoApp />);
      expect(screen.getByRole("heading", { name: "TODO" })).toBeInTheDocument();
    });

    it("入力欄が表示される", () => {
      render(<TodoApp />);
      expect(
        screen.getByPlaceholderText("新しいタスクを入力...")
      ).toBeInTheDocument();
    });

    it("「追加」ボタンが表示される", () => {
      render(<TodoApp />);
      expect(screen.getByRole("button", { name: "追加" })).toBeInTheDocument();
    });

    it("タスクがない場合「タスクがありません」が表示される", () => {
      render(<TodoApp />);
      expect(screen.getByText("タスクがありません")).toBeInTheDocument();
    });

    it("タスクがない場合フッターは表示されない", () => {
      render(<TodoApp />);
      expect(screen.queryByText(/件残り/)).not.toBeInTheDocument();
    });
  });

  describe("タスクの追加", () => {
    it("「追加」ボタンクリックでタスクを追加できる", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);
      await user.type(screen.getByPlaceholderText("新しいタスクを入力..."), "テストタスク");
      await user.click(screen.getByRole("button", { name: "追加" }));
      expect(screen.getByText("テストタスク")).toBeInTheDocument();
    });

    it("Enterキーでタスクを追加できる", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);
      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      await user.type(input, "Enterで追加{Enter}");
      expect(screen.getByText("Enterで追加")).toBeInTheDocument();
    });

    it("追加後に入力欄がクリアされる", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);
      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      await user.type(input, "テストタスク");
      await user.click(screen.getByRole("button", { name: "追加" }));
      expect(input).toHaveValue("");
    });

    it("空白のみの入力はタスクに追加されない", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);
      await user.type(screen.getByPlaceholderText("新しいタスクを入力..."), "   ");
      await user.click(screen.getByRole("button", { name: "追加" }));
      expect(screen.getByText("タスクがありません")).toBeInTheDocument();
    });

    it("複数のタスクを追加できる", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);
      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      await user.type(input, "タスク1{Enter}");
      await user.type(input, "タスク2{Enter}");
      await user.type(input, "タスク3{Enter}");
      expect(screen.getByText("タスク1")).toBeInTheDocument();
      expect(screen.getByText("タスク2")).toBeInTheDocument();
      expect(screen.getByText("タスク3")).toBeInTheDocument();
    });
  });

  describe("タスクの完了トグル", () => {
    it("チェックボックスでタスクを完了状態にできる", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);
      await user.type(screen.getByPlaceholderText("新しいタスクを入力..."), "タスク{Enter}");
      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it("完了済みタスクのテキストに取り消し線が付く", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);
      await user.type(screen.getByPlaceholderText("新しいタスクを入力..."), "タスク{Enter}");
      await user.click(screen.getByRole("checkbox"));
      const taskText = screen.getByText("タスク");
      expect(taskText).toHaveClass("line-through");
    });

    it("完了済みタスクを再クリックで未完了に戻せる", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);
      await user.type(screen.getByPlaceholderText("新しいタスクを入力..."), "タスク{Enter}");
      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  describe("タスクの削除", () => {
    it("削除ボタンでタスクを削除できる", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);
      await user.type(screen.getByPlaceholderText("新しいタスクを入力..."), "削除するタスク{Enter}");
      const deleteButton = screen.getByRole("button", { name: "削除" });
      await user.click(deleteButton);
      expect(screen.queryByText("削除するタスク")).not.toBeInTheDocument();
    });

    it("特定のタスクのみ削除される", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);
      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      await user.type(input, "タスクA{Enter}");
      await user.type(input, "タスクB{Enter}");
      const deleteButtons = screen.getAllByRole("button", { name: "削除" });
      await user.click(deleteButtons[0]);
      expect(screen.queryByText("タスクA")).not.toBeInTheDocument();
      expect(screen.getByText("タスクB")).toBeInTheDocument();
    });
  });

  describe("フィルタリング", () => {
    async function setupTodos() {
      const user = userEvent.setup();
      render(<TodoApp />);
      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      await user.type(input, "未完了タスク{Enter}");
      await user.type(input, "完了タスク{Enter}");
      const checkboxes = screen.getAllByRole("checkbox");
      await user.click(checkboxes[1]); // 2番目を完了にする
      return user;
    }

    it("「すべて」フィルターで全タスクが表示される", async () => {
      await setupTodos();
      await userEvent.setup().click(screen.getByRole("button", { name: "すべて" }));
      expect(screen.getByText("未完了タスク")).toBeInTheDocument();
      expect(screen.getByText("完了タスク")).toBeInTheDocument();
    });

    it("「未完了」フィルターで未完了タスクのみ表示される", async () => {
      const user = await setupTodos();
      await user.click(screen.getByRole("button", { name: "未完了" }));
      expect(screen.getByText("未完了タスク")).toBeInTheDocument();
      expect(screen.queryByText("完了タスク")).not.toBeInTheDocument();
    });

    it("「完了」フィルターで完了済みタスクのみ表示される", async () => {
      const user = await setupTodos();
      await user.click(screen.getByRole("button", { name: "完了" }));
      expect(screen.queryByText("未完了タスク")).not.toBeInTheDocument();
      expect(screen.getByText("完了タスク")).toBeInTheDocument();
    });
  });

  describe("完了済みタスクの一括削除", () => {
    it("「完了を削除」ボタンで完了済みタスクが削除される", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);
      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      await user.type(input, "未完了タスク{Enter}");
      await user.type(input, "完了タスク{Enter}");
      const checkboxes = screen.getAllByRole("checkbox");
      await user.click(checkboxes[1]);
      await user.click(screen.getByRole("button", { name: "完了を削除" }));
      expect(screen.getByText("未完了タスク")).toBeInTheDocument();
      expect(screen.queryByText("完了タスク")).not.toBeInTheDocument();
    });
  });

  describe("残り件数の表示", () => {
    it("タスク追加後にフッターが表示される", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);
      await user.type(screen.getByPlaceholderText("新しいタスクを入力..."), "タスク{Enter}");
      expect(screen.getByText(/件残り/)).toBeInTheDocument();
    });

    it("未完了タスク数が正しく表示される", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);
      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      await user.type(input, "タスク1{Enter}");
      await user.type(input, "タスク2{Enter}");
      await user.type(input, "タスク3{Enter}");
      expect(screen.getByText("3 件残り")).toBeInTheDocument();
    });

    it("タスク完了後に残り件数が減る", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);
      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      await user.type(input, "タスク1{Enter}");
      await user.type(input, "タスク2{Enter}");
      await user.click(screen.getAllByRole("checkbox")[0]);
      expect(screen.getByText("1 件残り")).toBeInTheDocument();
    });
  });
});

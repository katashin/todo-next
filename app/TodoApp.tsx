"use client";

import { useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type Filter = "all" | "active" | "completed";

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [...prev, { id: Date.now(), text, completed: false }]);
    setInput("");
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-purple-700 mb-8 tracking-tight">
          TODO
        </h1>

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="新しいタスクを入力..."
            className="flex-1 px-4 py-3 rounded-xl border border-purple-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700 placeholder-gray-400"
          />
          <button
            onClick={addTodo}
            className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-sm transition-colors"
          >
            追加
          </button>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {filteredTodos.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">
              タスクがありません
            </p>
          ) : (
            <ul>
              {filteredTodos.map((todo, i) => (
                <li
                  key={todo.id}
                  className={`flex items-center gap-3 px-5 py-4 ${
                    i !== 0 ? "border-t border-gray-100" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5 accent-purple-600 cursor-pointer flex-shrink-0"
                  />
                  <span
                    className={`flex-1 text-sm ${
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-700"
                    }`}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
                    aria-label="削除"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Footer */}
          {todos.length > 0 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
              <span>{activeCount} 件残り</span>
              <div className="flex gap-2">
                {(["all", "active", "completed"] as Filter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-2 py-1 rounded transition-colors ${
                      filter === f
                        ? "text-purple-600 font-semibold"
                        : "hover:text-gray-700"
                    }`}
                  >
                    {f === "all" ? "すべて" : f === "active" ? "未完了" : "完了"}
                  </button>
                ))}
              </div>
              <button
                onClick={clearCompleted}
                className="hover:text-red-400 transition-colors"
              >
                完了を削除
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

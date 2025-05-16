"use client";

import { useState, useRef } from "react";

export default function NewRecordPage() {
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/records", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("保存に失敗しました");
      alert("記録しました！");
      formRef.current?.reset(); // 安全にリセット
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">食事記録</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="meal" className="block text-sm font-medium text-gray-700">
            食事名
          </label>
          <input
            type="text"
            id="meal"
            name="meal"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="calories" className="block text-sm font-medium text-gray-700">
            カロリー (kcal)
          </label>
          <input
            type="number"
            id="calories"
            name="calories"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="datetime" className="block text-sm font-medium text-gray-700">
            日時
          </label>
          <input
            type="datetime-local"
            id="datetime"
            name="datetime"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          記録
        </button>
      </form>
    </div>
  );
}
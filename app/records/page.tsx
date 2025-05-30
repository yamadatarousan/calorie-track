"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Record = {
  id: number;
  meal: string;
  calories: number;
  date: string;
  userId: number;
};

export default function RecordsPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecords() {
      try {
        const response = await fetch("/api/records");
        if (!response.ok) throw new Error("データ取得に失敗しました");
        const data = await response.json();
        setRecords(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "エラーが発生しました");
      }
    }
    fetchRecords();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("この記録を削除しますか？")) return;
    try {
      const response = await fetch(`/api/records/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("削除に失敗しました");
      setRecords(records.filter((record) => record.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">食事記録一覧</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {records.length === 0 ? (
        <p className="text-gray-500">記録がありません。</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">食事名</th>
              <th className="border p-2 text-left">カロリー (kcal)</th>
              <th className="border p-2 text-left">日時</th>
              <th className="border p-2 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td className="border p-2">{record.meal}</td>
                <td className="border p-2">{record.calories}</td>
                <td className="border p-2">
                  {new Date(record.date).toLocaleString("ja-JP", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="border p-2 space-x-2">
                  <Link
                    href={`/records/${record.id}/edit`}
                    className="text-indigo-600 hover:underline"
                  >
                    編集
                  </Link>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="text-red-600 hover:underline"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Link
        href="/records/new"
        className="mt-4 inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
      >
        新しい記録を追加
      </Link>
    </div>
  );
}
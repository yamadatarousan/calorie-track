"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Exercise = {
  id: number;
  name: string;
  calories: number;
  date: string;
  userId: number;
};

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExercises() {
      try {
        const response = await fetch("/api/exercises");
        if (!response.ok) throw new Error("データ取得に失敗しました");
        const data = await response.json();
        setExercises(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "エラーが発生しました");
      }
    }
    fetchExercises();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("この運動記録を削除しますか？")) return;
    try {
      const response = await fetch(`/api/exercises/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("削除に失敗しました");
      setExercises(exercises.filter((exercise) => exercise.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">運動記録一覧</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {exercises.length === 0 ? (
        <p className="text-gray-500">記録がありません。</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">運動名</th>
              <th className="border p-2 text-left">カロリー (kcal)</th>
              <th className="border p-2 text-left">日時</th>
              <th className="border p-2 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((exercise) => (
              <tr key={exercise.id}>
                <td className="border p-2">{exercise.name}</td>
                <td className="border p-2">{exercise.calories}</td>
                <td className="border p-2">
                  {new Date(exercise.date).toLocaleString("ja-JP", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="border p-2 space-x-2">
                  <Link
                    href={`/exercises/${exercise.id}/edit`}
                    className="text-indigo-600 hover:underline"
                  >
                    編集
                  </Link>
                  <button
                    onClick={() => handleDelete(exercise.id)}
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
        href="/exercises/new"
        className="mt-4 inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
      >
        新しい運動記録を追加
      </Link>
    </div>
  );
}
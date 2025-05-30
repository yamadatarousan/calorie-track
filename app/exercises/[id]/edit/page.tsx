"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { exerciseSchema } from "@/lib/zodSchemas";

type Exercise = {
  id: number;
  name: string;
  calories: number;
  date: string;
  userId: number;
};

export default function EditExercisePage() {
  const params = useParams();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    async function fetchExercise() {
      try {
        const response = await fetch(`/api/exercises/${params.id}`);
        if (!response.ok) throw new Error("レコード取得に失敗しました");
        const data = await response.json();
        setExercise(data);
      } catch (e) {
        setErrors({ general: ["エラーが発生しました"] });
      }
    }
    fetchExercise();
  }, [params.id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name") as string,
      calories: parseInt(formData.get("calories") as string),
      datetime: formData.get("datetime") as string,
    };

    const parsed = exerciseSchema.safeParse(data);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    setErrors({});
    try {
      const response = await fetch(`/api/exercises/${params.id}`, {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData.errors || { general: ["サーバーエラー"] });
        return;
      }
      alert("更新しました！");
    } catch (e) {
      setErrors({ general: ["エラーが発生しました"] });
    }
  }

  if (errors.general && !exercise) return <p className="text-red-500">{errors.general.join(", ")}</p>;
  if (!exercise) return <p>読み込み中...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">運動記録編集</h1>
      {errors.general && <p className="text-red-500 mb-4">{errors.general.join(", ")}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            運動名
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={exercise.name}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.join(", ")}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="calories" className="block text-sm font-medium text-gray-700">
            カロリー (kcal)
          </label>
          <input
            type="number"
            id="calories"
            name="calories"
            defaultValue={exercise.calories}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
          {errors.calories && (
            <p className="text-red-500 text-sm mt-1">{errors.calories.join(", ")}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="datetime" className="block text-sm font-medium text-gray-700">
            日時
          </label>
          <input
            type="datetime-local"
            id="datetime"
            name="datetime"
            defaultValue={new Date(exercise.date).toISOString().slice(0, 16)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
          {errors.datetime && (
            <p className="text-red-500 text-sm mt-1">{errors.datetime.join(", ")}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          更新
        </button>
      </form>
      <Link href="/exercises" className="mt-4 inline-block text-indigo-600 hover:underline">
        一覧に戻る
      </Link>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { recordSchema } from "@/lib/zodSchemas";

type Record = {
  id: number;
  meal: string;
  calories: number;
  date: string;
  userId: number;
};

export default function EditRecordPage() {
  const params = useParams();
  const [record, setRecord] = useState<Record | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    async function fetchRecord() {
      try {
        const response = await fetch(`/api/records/${params.id}`);
        if (!response.ok) throw new Error("レコード取得に失敗しました");
        const data = await response.json();
        setRecord(data);
      } catch (e) {
        setErrors({ general: ["エラーが発生しました"] });
      }
    }
    fetchRecord();
  }, [params.id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      meal: formData.get("meal") as string,
      calories: parseInt(formData.get("calories") as string),
      datetime: formData.get("datetime") as string,
    };

    const parsed = recordSchema.safeParse(data);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    setErrors({});
    try {
      const response = await fetch(`/api/records/${params.id}`, {
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

  if (errors.general && !record) return <p className="text-red-500">{errors.general.join(", ")}</p>;
  if (!record) return <p>読み込み中...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">食事記録編集</h1>
      {errors.general && <p className="text-red-500 mb-4">{errors.general.join(", ")}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="meal" className="block text-sm font-medium text-gray-700">
            食事名
          </label>
          <input
            type="text"
            id="meal"
            name="meal"
            defaultValue={record.meal}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
          {errors.meal && <p className="text-red-500 text-sm mt-1">{errors.meal.join(", ")}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="calories" className="block text-sm font-medium text-gray-700">
            カロリー (kcal)
          </label>
          <input
            type="number"
            id="calories"
            name="calories"
            defaultValue={record.calories}
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
            defaultValue={new Date(record.date).toISOString().slice(0, 16)}
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
      <Link href="/records" className="mt-4 inline-block text-indigo-600 hover:underline">
        一覧に戻る
      </Link>
    </div>
  );
}
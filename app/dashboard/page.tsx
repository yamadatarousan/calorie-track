"use client";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type DashboardData = {
  labels: string[];
  intake: number[];
  burned: number[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7) // デフォルト: 当月 (例: "2025-05")
  );

  // 過去12ヶ月のオプションを生成
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toISOString().slice(0, 7); // 例: "2025-05"
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/dashboard?month=${selectedMonth}`);
        if (!response.ok) throw new Error("データ取得に失敗しました");
        const result = await response.json();
        setData(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : "エラーが発生しました");
      }
    }
    fetchData();
  }, [selectedMonth]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p>読み込み中...</p>;

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "摂取カロリー",
        data: data.intake,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
      },
      {
        label: "消費カロリー",
        data: data.burned,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: `カロリー推移 (${selectedMonth})` },
    },
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>
      <div className="mb-6">
        <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
          表示月
        </label>
        <select
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {monthOptions.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
}
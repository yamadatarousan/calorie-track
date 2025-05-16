import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month"); // 例: "2025-05"
    let startDate: Date, endDate: Date;

    if (month && /^\d{4}-\d{2}$/.test(month)) {
      const [year, monthNum] = month.split("-").map(Number);
      startDate = new Date(year, monthNum - 1, 1); // 月初
      endDate = new Date(year, monthNum, 0); // 月末
    } else {
      // デフォルト: 当月
      endDate = new Date();
      startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
    }

    // Record から日別の摂取カロリーを集計
    const records = await prisma.record.groupBy({
      by: ["date"],
      where: {
        userId: 1,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        calories: true,
      },
    });

    // 日付ごとにカロリーを整理
    const intakeCalories: { [key: string]: number } = {};
    const labels: string[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      labels.push(dateStr);
      intakeCalories[dateStr] = 0;
    }

    records.forEach((record) => {
      const dateStr = new Date(record.date).toISOString().split("T")[0];
      intakeCalories[dateStr] = record._sum.calories || 0;
    });

    // 仮の消費カロリー
    const burnedCalories = labels.map(() => 2000); // 固定2000kcal/日

    return NextResponse.json({
      labels,
      intake: Object.values(intakeCalories),
      burned: burnedCalories,
    });
  } catch (error) {
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
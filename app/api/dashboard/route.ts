import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 過去7日間の日付を基準に
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6); // 7日間

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

    // 仮の消費カロリー（後で実装）
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
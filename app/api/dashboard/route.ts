import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    let startDate: Date, endDate: Date;

    if (month && /^\d{4}-\d{2}$/.test(month)) {
      const [year, monthNum] = month.split("-").map(Number);
      startDate = new Date(year, monthNum - 1, 1);
      endDate = new Date(year, monthNum, 0);
    } else {
      endDate = new Date();
      startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
    }

    // 摂取カロリー（Record）
    const records = await prisma.record.groupBy({
      by: ["date"],
      where: {
        userId: 1,
        date: { gte: startDate, lte: endDate },
      },
      _sum: { calories: true },
    });

    // 消費カロリー（Exercise）
    const exercises = await prisma.exercise.groupBy({
      by: ["date"],
      where: {
        userId: 1,
        date: { gte: startDate, lte: endDate },
      },
      _sum: { calories: true },
    });

    // 日付ごとにカロリー整理
    const intakeCalories: { [key: string]: number } = {};
    const burnedCalories: { [key: string]: number } = {};
    const labels: string[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      labels.push(dateStr);
      intakeCalories[dateStr] = 0;
      burnedCalories[dateStr] = 0;
    }

    records.forEach((record) => {
      const dateStr = new Date(record.date).toISOString().split("T")[0];
      intakeCalories[dateStr] = record._sum.calories || 0;
    });

    exercises.forEach((exercise) => {
      const dateStr = new Date(exercise.date).toISOString().split("T")[0];
      burnedCalories[dateStr] = exercise._sum.calories || 0;
    });

    return NextResponse.json({
      labels,
      intake: Object.values(intakeCalories),
      burned: Object.values(burnedCalories),
    });
  } catch (error) {
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
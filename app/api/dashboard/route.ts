import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import pino from "pino";

const logger = pino({ level: "debug" });

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

    // 日付（YYYY-MM-DD）でグループ化してカロリー合計
    const records = await prisma.$queryRaw<
      Array<{ date: string; totalCalories: number }>
    >`
      SELECT DATE_FORMAT(date, '%Y-%m-%d') as date, SUM(calories) as totalCalories
      FROM Record
      WHERE userId = 1
      AND date >= ${startDate}
      AND date <= ${endDate}
      GROUP BY DATE_FORMAT(date, '%Y-%m-%d')
    `;
    logger.debug("Fetched records", { records });

    const exercises = await prisma.$queryRaw<
      Array<{ date: string; totalCalories: number }>
    >`
      SELECT DATE_FORMAT(date, '%Y-%m-%d') as date, SUM(calories) as totalCalories
      FROM Exercise
      WHERE userId = 1
      AND date >= ${startDate}
      AND date <= ${endDate}
      GROUP BY DATE_FORMAT(date, '%Y-%m-%d')
    `;
    logger.debug("Fetched exercises", { exercises });

    // 日付ごとのカロリー整理
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
      intakeCalories[record.date] = Number(record.totalCalories) || 0;
    });

    exercises.forEach((exercise) => {
      burnedCalories[exercise.date] = Number(exercise.totalCalories) || 0;
    });

    logger.info("Dashboard data prepared", { labels, intake: Object.values(intakeCalories).slice(0, 5) });

    return NextResponse.json({
      labels,
      intake: Object.values(intakeCalories),
      burned: Object.values(burnedCalories),
    });
  } catch (error) {
    logger.error("Server error", { error: error.message });
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
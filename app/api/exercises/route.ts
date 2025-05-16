import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import pino from "pino";

const logger = pino({ level: "debug" });

export async function GET() {
  try {
    logger.debug("Starting GET /api/exercises");
    logger.info("Fetching exercise records");
    const exercises = await prisma.exercise.findMany({
      where: { userId: 1 },
      orderBy: { date: "desc" },
    });
    logger.debug("Fetched exercises", { count: exercises.length });
    return NextResponse.json(exercises);
  } catch (error) {
    logger.error("Failed to fetch exercises", { error: error.message });
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    logger.debug("Starting POST /api/exercises");
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const calories = parseInt(formData.get("calories") as string);
    const datetime = new Date(formData.get("datetime") as string);

    if (!name || isNaN(calories) || isNaN(datetime.getTime())) {
      logger.error("Invalid input", { name, calories, datetime });
      return NextResponse.json({ error: "無効な入力です" }, { status: 400 });
    }

    const exercise = await prisma.exercise.create({
      data: { name, calories, date: datetime, userId: 1 },
    });

    logger.info("Exercise created", { id: exercise.id, name, calories });
    logger.debug("Exercise saved to DB", { exercise });
    return NextResponse.json(exercise, { status: 201 });
  } catch (error) {
    logger.error("Server error", { error: error.message });
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
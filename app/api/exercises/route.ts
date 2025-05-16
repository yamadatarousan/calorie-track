import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { exerciseSchema } from "@/lib/zodSchemas";
import pino from "pino";

const logger = pino({ level: "info" });

export async function GET() {
  try {
    logger.info("Fetching exercise records");
    const exercises = await prisma.exercise.findMany({
      where: { userId: 1 },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(exercises);
  } catch (error) {
    logger.error("Failed to fetch exercises", { error: error.message });
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data = {
      name: formData.get("name") as string,
      calories: parseInt(formData.get("calories") as string),
      datetime: formData.get("datetime") as string,
    };

    const parsed = exerciseSchema.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      logger.error("Validation failed", { errors });
      return NextResponse.json({ errors }, { status: 400 });
    }

    const { name, calories, datetime } = parsed.data;
    const exercise = await prisma.exercise.create({
      data: { name, calories, date: new Date(datetime), userId: 1 },
    });

    logger.info("Exercise created", { id: exercise.id, name, calories });
    return NextResponse.json(exercise, { status: 201 });
  } catch (error) {
    logger.error("Server error", { error: error.message });
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
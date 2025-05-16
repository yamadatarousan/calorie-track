import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { recordSchema } from "@/lib/zodSchemas";
import pino from "pino";

const logger = pino({ level: "info" });

export async function GET() {
  try {
    logger.info("Fetching records");
    const records = await prisma.record.findMany({
      where: { userId: 1 },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(records);
  } catch (error) {
    logger.error("Failed to fetch records", { error: error.message });
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data = {
      meal: formData.get("meal") as string,
      calories: parseInt(formData.get("calories") as string),
      datetime: formData.get("datetime") as string,
    };

    const parsed = recordSchema.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      logger.error("Validation failed", { errors });
      return NextResponse.json({ errors }, { status: 400 });
    }

    const { meal, calories, datetime } = parsed.data;
    const record = await prisma.record.create({
      data: { meal, calories, date: new Date(datetime), userId: 1 },
    });

    logger.info("Record created", { id: record.id, meal, calories });
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    logger.error("Server error", { error: error.message });
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
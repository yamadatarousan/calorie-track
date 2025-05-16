import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { exerciseSchema } from "@/lib/zodSchemas";
import pino from "pino";

const logger = pino({ level: "info" });

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || request.nextUrl.pathname.split("/").pop();
    if (!id) {
      logger.error("ID not specified");
      return NextResponse.json({ error: "IDが指定されていません" }, { status: 400 });
    }
    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(id) },
    });
    if (!exercise) {
      logger.error("Exercise not found", { id });
      return NextResponse.json({ error: "レコードが見つかりません" }, { status: 404 });
    }
    return NextResponse.json(exercise);
  } catch (error) {
    logger.error("Server error", { error: error.message });
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || request.nextUrl.pathname.split("/").pop();
    if (!id) {
      logger.error("ID not specified");
      return NextResponse.json({ error: "IDが指定されていません" }, { status: 400 });
    }
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
    const exercise = await prisma.exercise.update({
      where: { id: parseInt(id) },
      data: { name, calories, date: new Date(datetime) },
    });

    logger.info("Exercise updated", { id: exercise.id, name, calories });
    return NextResponse.json(exercise);
  } catch (error) {
    logger.error("Server error", { error: error.message });
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || request.nextUrl.pathname.split("/").pop();
    if (!id) {
      logger.error("ID not specified");
      return NextResponse.json({ error: "IDが指定されていません" }, { status: 400 });
    }
    await prisma.exercise.delete({
      where: { id: parseInt(id) },
    });
    logger.info("Exercise deleted", { id });
    return NextResponse.json({ message: "削除しました" });
  } catch (error) {
    logger.error("Server error", { error: error.message });
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}                                               
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { recordSchema } from "@/lib/zodSchemas";
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
    const record = await prisma.record.findUnique({
      where: { id: parseInt(id) },
    });
    if (!record) {
      logger.error("Record not found", { id });
      return NextResponse.json({ error: "レコードが見つかりません" }, { status: 404 });
    }
    return NextResponse.json(record);
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
    const record = await prisma.record.update({
      where: { id: parseInt(id) },
      data: { meal, calories, date: new Date(datetime) },
    });

    logger.info("Record updated", { id: record.id, meal, calories });
    return NextResponse.json(record);
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
    await prisma.record.delete({
      where: { id: parseInt(id) },
    });
    logger.info("Record deleted", { id });
    return NextResponse.json({ message: "削除しました" });
  } catch (error) {
    logger.error("Server error", { error: error.message });
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
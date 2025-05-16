import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const meal = formData.get("meal") as string;
    const calories = parseInt(formData.get("calories") as string);
    const datetime = new Date(formData.get("datetime") as string);

    if (!meal || isNaN(calories) || isNaN(datetime.getTime())) {
      return NextResponse.json({ error: "無効な入力です" }, { status: 400 });
    }

    const record = await prisma.record.create({
      data: {
        meal,
        calories,
        date: datetime,
        userId: 1, // 仮の userId
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
      const exercises = await prisma.exercise.findMany({
        where: { userId: 1 }, // 仮の userId
        orderBy: { date: "desc" },
      });
      return NextResponse.json(exercises);
    } catch (error) {
      return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
    }
}  

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const calories = parseInt(formData.get("calories") as string);
    const datetime = new Date(formData.get("datetime") as string);

    if (!name || isNaN(calories) || isNaN(datetime.getTime())) {
      return NextResponse.json({ error: "無効な入力です" }, { status: 400 });
    }

    const exercise = await prisma.exercise.create({
      data: {
        name,
        calories,
        date: datetime,
        userId: 1, // 仮の userId
      },
    });

    return NextResponse.json(exercise, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
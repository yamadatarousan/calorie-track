import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || request.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json({ error: "IDが指定されていません" }, { status: 400 });
    }
    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(id) },
    });
    if (!exercise) {
      return NextResponse.json({ error: "レコードが見つかりません" }, { status: 404 });
    }
    return NextResponse.json(exercise);
  } catch (error) {
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || request.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json({ error: "IDが指定されていません" }, { status: 400 });
    }
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const calories = parseInt(formData.get("calories") as string);
    const datetime = new Date(formData.get("datetime") as string);

    if (!name || isNaN(calories) || isNaN(datetime.getTime())) {
      return NextResponse.json({ error: "無効な入力です" }, { status: 400 });
    }

    const exercise = await prisma.exercise.update({
      where: { id: parseInt(id) },
      data: {
        name,
        calories,
        date: datetime,
      },
    });

    return NextResponse.json(exercise);
  } catch (error) {
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || request.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json({ error: "IDが指定されていません" }, { status: 400 });
    }
    await prisma.exercise.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: "削除しました" });
  } catch (error) {
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
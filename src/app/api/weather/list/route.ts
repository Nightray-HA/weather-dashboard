import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.weather.findMany({
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Gagal ambil data cuaca" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city");

  if (!city) {
    return NextResponse.json({ message: "Nama kota wajib diisi" }, { status: 400 });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY; 
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    );
    const data = await res.json();

    if (!data || data.length === 0) {
      return NextResponse.json({ message: "Kota tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(data[0]);
  } catch (err) {
    return NextResponse.json({ message: "Gagal ambil koordinat" }, { status: 500 });
  }
}

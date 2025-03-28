import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ message: "Lat/lon tidak valid" }, { status: 400 });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
    );
    const data = await res.json();

    if (!data || data.length === 0) {
      return NextResponse.json({ message: "Kota tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ name: data[0].name });
  } catch (err) {
    return NextResponse.json({ message: "Gagal reverse geocoding" }, { status: 500 });
  }
}

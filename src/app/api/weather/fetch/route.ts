import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const API_KEY = process.env.OPENWEATHER_API_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { city, lat, lon } = body;

    if (!lat || !lon || !city) {
      return NextResponse.json({ message: "Lat, Lon, dan Kota wajib diisi." }, { status: 400 });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat.toFixed(2)}&lon=${lon.toFixed(2)}&units=metric&appid=${API_KEY}`;
    console.log("🔗 Fetching:", url);

    const res = await fetch(url);
    const data = await res.json();
    console.log("🌤 Weather Data:", data);

    if (!data || !data.main || !data.dt) {
      return NextResponse.json({ message: "Data tidak ditemukan dari OpenWeather." }, { status: 400 });
    }

    const weather = await prisma.weather.create({
      data: {
        city: data.name || city,
        lat: data.coord.lat,
        lon: data.coord.lon,
        temp: data.main.temp,
        humidity: data.main.humidity,
        condition: data.weather[0].main,
        rain: data.rain?.["1h"] ?? 0,
        timestamp: new Date(data.dt * 1000),
      },
    });

    return NextResponse.json({ message: "✅ Data cuaca disimpan.", weather });
  } catch (err) {
    console.error("❌ Error:", err);
    return NextResponse.json({ message: "Gagal ambil atau simpan data cuaca." }, { status: 500 });
  }
}

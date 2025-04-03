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

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    console.log("Fetching:", url);

    const res = await fetch(url);
    const data = await res.json();
    console.log("Weather Data:", data);

    if (!data || !data.main || !data.dt) {
      return NextResponse.json({ message: "Data tidak ditemukan dari OpenWeather." }, { status: 400 });
    }

    const weatherData = {
      city: data.name || city,
      country: data.sys.country || "Unknown",
      lat: data.coord.lat,
      lon: data.coord.lon,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      temp_min: data.main.temp_min,
      temp_max: data.main.temp_max,
      pressure: data.main.pressure,
      sea_level: data.main.sea_level || null,
      grnd_level: data.main.grnd_level || null,
      humidity: data.main.humidity,
      visibility: data.visibility,
      wind_speed: data.wind?.speed || 0,
      wind_deg: data.wind?.deg || 0,
      wind_gust: data.wind?.gust || null,
      clouds: data.clouds?.all || 0,
      rain: data.rain?.["1h"] ?? 0,
      condition: data.weather[0]?.main || "Unknown",
      description: data.weather[0]?.description || "No description",
      icon: data.weather[0]?.icon || "01d",
      timezone: data.timezone,
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),
      timestamp: new Date(data.dt * 1000),
      updatedAt: new Date(),
    };

    const existingWeather = await prisma.weather.findFirst({
      where: { city: weatherData.city }
    });

    if (existingWeather) {
      const updatedWeather = await prisma.weather.update({
        where: { id: existingWeather.id },
        data: weatherData,
      });

      const { updatedAt, ...historyData } = weatherData;
      await prisma.weatherHistory.create({
        data: {
          weatherId: updatedWeather.id,
          ...historyData
        }
      });

      return NextResponse.json({ message: "✅ Data cuaca diperbarui.", weather: updatedWeather });
    } else {
      const newWeather = await prisma.weather.create({
        data: weatherData,
      });
      const { updatedAt, ...historyData } = weatherData;
      await prisma.weatherHistory.create({
        data: {
          weatherId: newWeather.id,
          ...historyData
        }
      });

      return NextResponse.json({ message: "✅ Data cuaca disimpan.", weather: newWeather });
    }
  } catch (err) {
    console.error("❌ Error:", err);
    return NextResponse.json({ message: "Gagal ambil atau simpan data cuaca." }, { status: 500 });
  }
}

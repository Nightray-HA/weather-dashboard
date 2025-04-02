import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const API_KEY = process.env.OPENWEATHER_API_KEY;

export async function POST() {
  try {
    const cities = await prisma.weather.findMany();

    if (cities.length === 0) {
      return NextResponse.json({ message: "Tidak ada data cuaca yang tersimpan." }, { status: 404 });
    }

    const updatedWeathers = [];
    for (const city of cities) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      console.log("Fetching:", data);
      if (data.cod !== 200) {
        console.error(`❌ Gagal memperbarui data untuk kota: ${city.city}`);
        continue;
      }

      const weatherData = {
        city: data.name || city.city,
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
        humidity: data.main.humidity || 0,
        visibility: data.visibility || 0,
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

      // Update weather yang sudah ada
      const updatedWeather = await prisma.weather.update({
        where: { id: city.id },
        data: weatherData,
      });

      // Simpan history update-nya
      const { updatedAt, ...historyData } = weatherData;
      await prisma.weatherHistory.create({
        data: { weatherId: updatedWeather.id, ...historyData },
      });

      updatedWeathers.push(updatedWeather);
    }

    return NextResponse.json({ message: "✅ Semua data cuaca berhasil diperbarui.", updatedWeathers });
  } catch (err) {
    console.error("❌ Error:", err);
    return NextResponse.json({ message: "Gagal memperbarui data cuaca." }, { status: 500 });
  }
}

import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { getWeatherCategory } from "@/lib/weatherCategory";

const prisma = new PrismaClient();

type Props = {
  params: {
    id: string;
  };
};

export default async function CityDetailPage({ params }: Props) {
  const { id } = await params;
  const weatherId = parseInt(id, 10);

  if (isNaN(weatherId)) {
    return (
      <div className="p-6 text-red-500 text-lg text-center">ID tidak valid.</div>
    );
  }

  const weather = await prisma.weather.findUnique({
    where: { id: weatherId },
    include: {
      histories: {
        orderBy: { id: "desc" },
      },
    },
  });

  if (!weather) {
    return (
      <div className="p-6 space-y-4 max-w-lg mx-auto text-center">
        <p className="text-red-500 text-lg">Data cuaca tidak ditemukan.</p>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 mx-auto">
      <div>
        <Link
          href="/dashboard"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>

      {/* Detail Cuaca Utama */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-3">Detail Cuaca: {weather.city}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p><strong>Kode Negara:</strong> {weather.country}</p>
          <p><strong>Kota:</strong> {weather.city}</p>
          <p><strong>Koordinat:</strong> {weather.lat}, {weather.lon}</p>
          <p><strong>Suhu:</strong> {weather.temp} °C</p>
          <p><strong>Kelembapan:</strong> {weather.humidity}%</p>
          <p><strong>Curah Hujan:</strong> {weather.rain ?? 0} mm</p>
          <p><strong>Kondisi:</strong> {weather.condition}</p>
          <p><strong>Waktu Data:</strong> {new Date(weather.timestamp).toLocaleString("id-ID")}</p>
          <p><strong>Sunrise:</strong> {new Date(weather.sunrise).toLocaleTimeString("id-ID")}</p>
          <p><strong>Sunset:</strong> {new Date(weather.sunset).toLocaleTimeString("id-ID")}</p>
          <p><strong>Wind Speed:</strong> {weather.wind_speed} m/s</p>
          <p><strong>Wind Deg:</strong> {weather.wind_deg}°</p>
          <p><strong>Wind Gust:</strong> {weather.wind_gust ?? 0} m/s</p>
          <p><strong>Tekanan Udara:</strong> {weather.pressure} hPa</p>
          <p><strong>Jarak Pandang:</strong> {weather.visibility} m</p>
        </div>
      </section>

      {/* Riwayat Cuaca */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded shadow-md">
        <h2 className="text-xl font-bold mb-3">Riwayat Cuaca</h2>

        {weather.histories.length === 0 ? (
          <p className="text-gray-500">Belum ada riwayat cuaca yang disimpan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-gray-200">
              <thead>
                <tr>
                  <th className="p-2 border">Kode Negara</th>
                  <th className="p-2 border">Kota</th>
                  <th className="p-2 border">Suhu</th>
                  <th className="p-2 border">Kategori</th>
                  <th className="p-2 border">Kelembapan</th>
                  <th className="p-2 border">Kategori Kelembapan</th>
                  <th className="p-2 border">Curah Hujan</th>
                  <th className="p-2 border">Kategori Hujan</th>
                  <th className="p-2 border">Kondisi</th>
                  <th className="p-2 border">Wind Speed</th>
                  <th className="p-2 border">Kategori Angin</th>
                  <th className="p-2 border">Sunrise</th>
                  <th className="p-2 border">Sunset</th>
                  <th className="p-2 border">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {weather.histories.map((hist) => {
                  const cat = getWeatherCategory({
                    temp: hist.temp,
                    humidity: hist.humidity,
                    rain: hist.rain ?? 0,
                    condition: hist.condition ?? "Clear",
                    wind_speed: hist.wind_speed,
                  });

                  return (
                    <tr key={hist.id} className="border-t">
                      <td className="p-2 border">{hist.country}</td>
                      <td className="p-2 border">{hist.city}</td>
                      <td className="p-2 border">{hist.temp} °C</td>
                      <td className="p-2 border">{cat.suhuKategori}</td>
                      <td className="p-2 border">{hist.humidity}%</td>
                      <td className="p-2 border">{cat.kelembapanAlert}</td>
                      <td className="p-2 border">{hist.rain ?? 0} mm</td>
                      <td className="p-2 border">{cat.hujanKategori}</td>
                      <td className="p-2 border">{cat.conditionCategory}</td>
                      <td className="p-2 border">{hist.wind_speed} m/s</td>
                      <td className="p-2 border">{cat.windCategory}</td>
                      <td className="p-2 border">{new Date(hist.sunrise).toLocaleTimeString("id-ID")}</td>
                      <td className="p-2 border">{new Date(hist.sunset).toLocaleTimeString("id-ID")}</td>
                      <td className="p-2 border">{new Date(hist.timestamp).toLocaleString("id-ID")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
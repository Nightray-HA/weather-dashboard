'use client';

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getWeatherCategory } from "@/lib/weatherCategory";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  Legend, ResponsiveContainer
} from "recharts";
import Pagination from "@/components/Pagination";

type WeatherData = {
  id: number;
  city: string;
  lat: number;
  lon: number;
  temp: number;
  humidity: number;
  rain: number | null;
  timestamp: string;
  condition?: string;
};

const presetCities = [
  { label: "Jakarta", value: "Jakarta" },
  { label: "Bandung", value: "Bandung" },
  { label: "Surabaya", value: "Surabaya" },
  { label: "Yogyakarta", value: "Yogyakarta" },
  { label: "Medan", value: "Medan" },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFF"];

const MapPickerWithCity = dynamic(() => import("@/components/MapPickerWithCity"), { ssr: false });

export default function DashboardPage() {
  const [data, setData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("");
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    const res = await fetch("/api/weather/list");
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  const handleCitySelect = async (cityName: string) => {
    setSelectedPreset(cityName);
    setCity(cityName);
    setMessage("🔎 Mencari koordinat...");

    try {
      const res = await fetch(`/api/geo?city=${cityName}`);
      const data = await res.json();

      if (data.lat && data.lon) {
        setLat(data.lat.toString());
        setLon(data.lon.toString());
        setMessage("✅ Koordinat ditemukan.");
      } else {
        setMessage("❌ Kota tidak ditemukan.");
      }
    } catch {
      setMessage("❌ Gagal mencari kota.");
    }
  };

  const handleFetchWeather = async () => {
    if (!city || !lat || !lon) {
      setMessage("⚠️ Mohon isi kota, lat, dan lon.");
      return;
    }

    setFetching(true);
    setMessage("");

    const res = await fetch("/api/weather/fetch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city, lat: parseFloat(lat), lon: parseFloat(lon) }),
    });

    const json = await res.json();

    if (res.ok) {
      setMessage("✅ Data cuaca berhasil ditambahkan.");
      getData();
    } else {
      setMessage(`❌ ${json.message}`);
    }

    setFetching(false);
  };

  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const rainCategoryCount = data.reduce<Record<string, number>>((acc, item) => {
    const category = getWeatherCategory({
      temp: item.temp,
      humidity: item.humidity,
      rain: item.rain ?? 0,
      condition: item.condition || "Clear",
    }).hujanKategori;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const weatherConditionCount = data.reduce<Record<string, number>>((acc, item) => {
    const category = getWeatherCategory({
      temp: item.temp,
      humidity: item.humidity,
      rain: item.rain ?? 0,
      condition: item.condition || "Clear",
    }).conditionCategory;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const barChartData = Object.entries(rainCategoryCount).map(([key, value]) => ({
    kategori: key,
    Jumlah: value,
  }));

  const pieChartData = Object.entries(weatherConditionCount).map(([key, value]) => ({
    name: key,
    value,
  }));

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-blue-700">Dashboard Cuaca</h1>

      {/* Input Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold">📍 Ambil Data Cuaca</h2>

        <div className="flex flex-wrap gap-3 items-center">
          <label className="text-sm font-medium">Kota Populer:</label>
          <select
            value={selectedPreset}
            onChange={(e) => handleCitySelect(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-md text-sm w-[200px]"
          >
            <option value="" disabled hidden>Pilih kota</option>
            {presetCities.map((city) => (
              <option key={city.value} value={city.value}>{city.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-3">
          <input
            className="border px-3 py-2 rounded-md w-[150px] text-sm"
            placeholder="Nama Kota"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setSelectedPreset("");
            }}
          />
          <input
            className="border px-3 py-2 rounded-md w-[120px] text-sm"
            placeholder="Latitude"
            value={lat}
            onChange={(e) => {
              setLat(e.target.value);
              setSelectedPreset("");
            }}
          />
          <input
            className="border px-3 py-2 rounded-md w-[120px] text-sm"
            placeholder="Longitude"
            value={lon}
            onChange={(e) => {
              setLon(e.target.value);
              setSelectedPreset("");
            }}
          />
          <button
            onClick={handleFetchWeather}
            disabled={fetching}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-md disabled:opacity-50"
          >
            {fetching ? "Mengambil..." : "Ambil Cuaca"}
          </button>
        </div>

        <p className="text-sm text-gray-500">
          Atau pilih lokasi dari peta di bawah ini:
        </p>

        <MapPickerWithCity
          onSelect={(latVal, lonVal, cityName) => {
            setLat(latVal);
            setLon(lonVal);
            setCity(cityName);
            setSelectedPreset("");
            setMessage(`📍 Lokasi dipilih: ${cityName}`);
          }}
        />

        {message && <p className="text-sm text-blue-700 mt-2">{message}</p>}
      </section>

      {/* Chart Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">🌧 Kategori Hujan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <XAxis dataKey="kategori" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Jumlah" fill="#00BFFF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">🌤 Sebaran Cuaca</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieChartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Tabel Cuaca dengan Pagination */}
      <section>
        <h2 className="text-xl font-semibold mb-2">🧾 Tabel Data Cuaca</h2>
        <div className="overflow-x-auto border rounded-lg">
          {loading ? (
            <p className="p-4">Memuat data...</p>
          ) : (
            <>
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="p-2">Kota</th>
                    <th className="p-2">Cuaca</th>
                    <th className="p-2">Suhu (°C)</th>
                    <th className="p-2">Kategori Suhu</th>
                    <th className="p-2">Kelembapan</th>
                    <th className="p-2">Kategori Kelembapan</th>
                    <th className="p-2">Hujan</th>
                    <th className="p-2">Kategori Hujan</th>
                    <th className="p-2">Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((w) => {
                    const category = getWeatherCategory({
                      temp: w.temp,
                      humidity: w.humidity,
                      rain: w.rain ?? 0,
                      condition: w.condition || "Clear",
                    });

                    const highlight = category.suhuKategori === "Panas Ekstrem" || category.hujanKategori === "Hujan Lebat"
                      ? "bg-red-50 dark:bg-red-900/20"
                      : "";

                    return (
                      <tr key={w.id} className={`border-t ${highlight}`}>
                        <td className="p-2">{w.city}</td>
                        <td className="p-2">{category.conditionCategory}</td>
                        <td className="p-2">{w.temp}</td>
                        <td className="p-2">{category.suhuKategori}</td>
                        <td className="p-2">{w.humidity}%</td>
                        <td className="p-2">{category.kelembapanAlert}</td>
                        <td className="p-2">{w.rain ?? 0} mm</td>
                        <td className="p-2">{category.hujanKategori}</td>
                        <td className="p-2">{new Date(w.timestamp).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}

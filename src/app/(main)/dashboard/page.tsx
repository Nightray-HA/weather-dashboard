"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getWeatherCategory } from "@/lib/weatherCategory";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

type WeatherData = {
  id: number;
  city: string;
  lat: number;
  lon: number;
  temp: number;
  humidity: number;
  pressure: number;
  visibility: number;
  wind_speed: number;
  rain: number | null;
  timestamp: string;
  condition?: string;
  updatedAt: string;
};

const presetCities = [
  { label: "Jakarta", value: "Jakarta" },
  { label: "Bandung", value: "Bandung" },
  { label: "Surabaya", value: "Surabaya" },
  { label: "Yogyakarta", value: "Yogyakarta" },
  { label: "Medan", value: "Medan" },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFF"];

// Menggunakan dynamic import untuk MapPickerWithCity agar tidak di-render di server
const MapPickerWithCity = dynamic(() => import("@/components/MapPickerWithCity"), { ssr: false });

export default function DashboardPage() {
  const [data, setData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  // State for input & city selection
  const [city, setCity] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("");
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch data on mount
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    const res = await fetch("/api/weather/list");
    const json = await res.json();

    if (Array.isArray(json)) {
      setData(json);
    } else if (json && Array.isArray(json.data)) {
      setData(json.data);
    } else {
      setData([]);
    }
    setLoading(false);
  };

  const handleUpdateWeather = async () => {
    setFetching(true);
    setMessage("");

    try {
      const res = await fetch("/api/weather/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();

      if (res.ok) {
        setMessage("✅ Semua data cuaca berhasil diperbarui.");
        getData();
      } else {
        setMessage(`❌ ${json.message}`);
      }
    } catch (error) {
      setMessage("❌ Gagal memperbarui data cuaca.");
    } finally {
      setFetching(false);
    }
  };

  // Pilih kota dari dropdown
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

  // Fetch cuaca
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

  const columnHelper = createColumnHelper<WeatherData>();
  const columns = [
    // Nama Kota (link ke /city/[id])
    columnHelper.accessor("city", {
      id: "cityLink",
      header: "Kota",
      cell: (info) => {
        const row = info.row.original;
        return (
          <Link href={`/city/${row.id}`} className="text-blue-600 underline">
            {row.city}
          </Link>
        );
      },
    }),
    // Tekanan Udara
    columnHelper.accessor("pressure", {
      header: "Tekanan Udara (hPa)",
    }),
    // Jarak Pandang
    columnHelper.accessor("visibility", {
      header: "Jarak Pandang (m)",
    }),
    // Kecepatan Angin
    columnHelper.accessor("wind_speed", {
      header: "Wind Speed (m/s)",
    }),
    // Suhu & kategori
    columnHelper.accessor("temp", {
      id: "tempInfo",
      header: "Suhu (°C)",
      cell: (info) => {
        const row = info.row.original;
        const cat = getWeatherCategory({
          temp: row.temp,
          humidity: row.humidity,
          rain: row.rain ?? 0,
          condition: row.condition || "Clear",
        });
        return (
          <div>
            <div>Suhu: {row.temp}°C</div>
            <div className="text-sm text-gray-500">Kategori: {cat.suhuKategori}</div>
          </div>
        );
      },
    }),
    // Kelembapan
    columnHelper.accessor("humidity", {
      id: "humidityInfo",
      header: "Kelembapan",
      cell: (info) => {
        const row = info.row.original;
        const cat = getWeatherCategory({
          temp: row.temp,
          humidity: row.humidity,
          rain: row.rain ?? 0,
          condition: row.condition || "Clear",
        });
        return (
          <div>
            <div>{row.humidity}%</div>
            <div className="text-xs text-gray-500">{cat.kelembapanAlert}</div>
          </div>
        );
      },
    }),
    // Curah Hujan
    columnHelper.accessor("rain", {
      id: "rainInfo",
      header: "Curah Hujan",
      cell: (info) => {
        const row = info.row.original;
        const cat = getWeatherCategory({
          temp: row.temp,
          humidity: row.humidity,
          rain: row.rain ?? 0,
          condition: row.condition || "Clear",
        });
        return (
          <div>
            <div>{row.rain ?? 0} mm</div>
            <div className="text-xs text-gray-500">{cat.hujanKategori}</div>
          </div>
        );
      },
    }),
    // Kondisi Cuaca + Timestamp
    columnHelper.accessor("condition", {
      id: "conditionInfo",
      header: "Kondisi",
      cell: (info) => {
        const row = info.row.original;
        const cat = getWeatherCategory({
          temp: row.temp,
          humidity: row.humidity,
          rain: row.rain ?? 0,
          condition: row.condition || "Clear",
        });
        return (
          <div>
            <div className="font-semibold">{cat.conditionCategory}</div>
            <div className="text-xs text-gray-500">
              {new Date(row.timestamp).toLocaleString()}
            </div>
          </div>
        );
      },
    }),
    // last updated
    columnHelper.accessor("updatedAt", {
      id: "updatedAt",
      header: "Terakhir Diperbarui",
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="text-xs text-gray-500">
            {new Date(row.updatedAt).toLocaleString()}
          </div>
        );
      },
    }),
  ];

  // Instance table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 7,
      },
    },
  });

  const rainCategoryCount = data.reduce<Record<string, number>>((acc, item) => {
    const cat = getWeatherCategory({
      temp: item.temp,
      humidity: item.humidity,
      rain: item.rain ?? 0,
      condition: item.condition || "Clear",
    }).hujanKategori;
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const barChartData = Object.entries(rainCategoryCount).map(([key, value]) => ({
    kategori: key,
    Jumlah: value,
  }));

  const weatherConditionCount = data.reduce<Record<string, number>>((acc, item) => {
    const cat = getWeatherCategory({
      temp: item.temp,
      humidity: item.humidity,
      rain: item.rain ?? 0,
      condition: item.condition || "Clear",
    }).conditionCategory;
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

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
            <option value="" disabled hidden>
              Pilih kota
            </option>
            {presetCities.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
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
              <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
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

      {/* Table TanStack with Sorting */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">🧾 Tabel Data Cuaca</h2>
            <button
            onClick={handleUpdateWeather}
            disabled={fetching}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm rounded-md disabled:opacity-50"
            >
            {fetching ? "Memperbarui..." : "Update Cuaca"}
            </button>
        </div>

        {message && <p className="text-sm text-blue-700 mt-2">{message}</p>}
        <div className="overflow-x-auto border rounded-lg mt-3">
          {loading ? (
            <p className="p-4">Memuat data...</p>
          ) : (
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="p-2 border cursor-pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? ""}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-t">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-2 border">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-sm rounded disabled:opacity-50"
          >
            ← Previous
          </button>
          <span className="text-sm">
            Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-sm rounded disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </section>
    </div>
  );
}

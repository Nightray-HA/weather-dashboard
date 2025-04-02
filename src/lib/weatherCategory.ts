export function getWeatherCategory(data: {
  temp: number;
  humidity: number;
  rain: number;
  condition: string;
  wind_speed?: number;
}) {
  // Kategori kondisi cuaca
  let conditionCategory = "Tidak Diketahui";
  switch (data.condition) {
    case "Clear":
      conditionCategory = "Cerah";
      break;
    case "Clouds":
      conditionCategory = "Berawan";
      break;
    case "Rain":
    case "Drizzle":
      conditionCategory = "Hujan";
      break;
    case "Thunderstorm":
      conditionCategory = "Badai";
      break;
    case "Snow":
      conditionCategory = "Salju";
      break;
    case "Mist":
    case "Haze":
      conditionCategory = "Kabut";
      break;
  }

  // Kategori suhu
  const suhuKategori =
    data.temp >= 35 ? "Panas Ekstrem" :
      data.temp >= 30 ? "Panas" :
        data.temp < 20 ? "Sejuk" :
          "Normal";

  // Kategori hujan
  const hujanKategori =
    data.rain >= 10 ? "Hujan Lebat" :
      data.rain >= 5 ? "Hujan Sedang" :
        data.rain > 0 ? "Gerimis" :
          "Tidak Hujan";

  // Alert kelembapan
  const kelembapanAlert = data.humidity >= 80 ? "Kelembapan Tinggi" : "Kelembapan Sedang";

  // Kategori angin (opsional)
  let windCategory = "-";
  if (typeof data.wind_speed === "number") {
    if (data.wind_speed >= 20) {
      windCategory = "Angin Kencang";
    } else if (data.wind_speed >= 8) {
      windCategory = "Angin Sedang";
    } else {
      windCategory = "Angin Tenang";
    }
  }

  return {
    conditionCategory,
    suhuKategori,
    hujanKategori,
    kelembapanAlert,
    windCategory,
  };
}

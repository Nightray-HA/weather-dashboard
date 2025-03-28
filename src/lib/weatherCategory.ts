export function getWeatherCategory(data: {
  temp: number;
  humidity: number;
  rain: number;
  condition: string;
}) {
  let conditionCategory = "Tidak Diketahui";
  switch (data.condition) {
    case "Clear":
      conditionCategory = "Cerah";
      break;
    case "Clouds":
      conditionCategory = "Berawan";
      break;
    case "Rain":
      conditionCategory = "Hujan";
      break;
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
      conditionCategory = "Kabut";
      break;
    case "Haze":
      conditionCategory = "Kabut";
      break;
  }

  const suhuKategori =
    data.temp >= 35
      ? "Panas Ekstrem"
      : data.temp >= 30
      ? "Panas"
      : data.temp < 20
      ? "Sejuk"
      : "Normal";

  const hujanKategori =
    data.rain >= 10
      ? "Hujan Lebat"
      : data.rain >= 5
      ? "Hujan Sedang"
      : data.rain > 0
      ? "Gerimis"
      : "Tidak Hujan";

  const kelembapanAlert = data.humidity >= 80 ? "Kelembapan Tinggi" : "-";

  return { conditionCategory, suhuKategori, hujanKategori, kelembapanAlert };
}

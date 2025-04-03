'use client';

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

type Props = {
  onSelect: (lat: string, lon: string, city: string) => void;
  lat?: string;
  lon?: string;
};

function ClickHandler({ onSelect, lat, lon }: Props) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const map = useMap();

  useEffect(() => {
    if (lat && lon) {
      const parsedLat = parseFloat(lat);
      const parsedLon = parseFloat(lon);
      if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
        setPosition({ lat: parsedLat, lng: parsedLon });
        map.setView([parsedLat, parsedLon], map.getZoom());
      }
    }
  }, [lat, lon, map]);

  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);

      try {
        const res = await fetch(`/api/reverse?lat=${lat}&lon=${lng}`);
        const data = await res.json();
        const city = data.name || "Tidak diketahui";

        onSelect(lat.toString(), lng.toString(), city);
      } catch (err) {
        onSelect(lat.toString(), lng.toString(), "Gagal mendapatkan nama kota");
      }
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function MapPickerWithCity({ onSelect, lat, lon }: Props) {
  const defaultLat = lat ? parseFloat(lat) : -6.2;
  const defaultLon = lon ? parseFloat(lon) : 106.8;

  return (
    <div className="h-[50vh] w-full mt-4 rounded-md overflow-hidden">
      <MapContainer
        center={[defaultLat, defaultLon]}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onSelect={onSelect} lat={lat} lon={lon} />
      </MapContainer>
    </div>
  );
}
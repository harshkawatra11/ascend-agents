"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { riskColor, riskLabel, type Facility } from "@/data/district";
import "leaflet/dist/leaflet.css";

export function DistrictMap({
  facilities,
  height = 420,
  onSelect,
}: {
  facilities: Facility[];
  height?: number;
  onSelect?: (facility: Facility) => void;
}) {
  const center: [number, number] = [26.88, 75.8];

  return (
    <div className="border border-hairline overflow-hidden" style={{ height }}>
      <MapContainer
        center={center}
        zoom={10}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {facilities.map((f) => (
          <CircleMarker
            key={f.id}
            center={[f.lat, f.lng]}
            radius={10}
            eventHandlers={onSelect ? { click: () => onSelect(f) } : undefined}
            pathOptions={{
              color: riskColor[f.riskLevel],
              fillColor: riskColor[f.riskLevel],
              fillOpacity: 0.85,
              weight: 2,
            }}
          >
            <Tooltip direction="top" offset={[0, -6]}>
              <div className="font-sans text-xs">
                <p className="font-semibold">{f.name}</p>
                <p>{f.type} · {riskLabel[f.riskLevel]}</p>
                <p>Score: {f.performance.overall}</p>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

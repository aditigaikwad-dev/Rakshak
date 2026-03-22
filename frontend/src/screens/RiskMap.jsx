import 'leaflet/dist/leaflet.css';
import { useMemo, useState } from 'react';
import { MapContainer, Polygon, TileLayer, Tooltip } from 'react-leaflet';
import Card from '../components/ui/Card';
import { wards } from '../services/mockData';

const riskColor = (score) => {
  if (score >= 0.75) return '#7C3AED';
  if (score >= 0.55) return '#EF4444';
  if (score >= 0.35) return '#F59E0B';
  return '#10B981';
};

const squareAround = ([lat, lng], size = 0.004) => [
  [lat - size, lng - size],
  [lat - size, lng + size],
  [lat + size, lng + size],
  [lat + size, lng - size]
];

export default function RiskMap() {
  const [minRisk, setMinRisk] = useState(0);

  const filtered = useMemo(() => wards.filter((ward) => ward.risk >= minRisk), [minRisk]);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
        <label className="text-xs text-slate-400">Minimum Risk</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={minRisk}
          onChange={(e) => setMinRisk(Number(e.target.value))}
          className="w-52"
        />
        <span className="text-xs font-semibold text-slate-200">{Math.round(minRisk * 100)}%</span>
      </div>

      <Card className="h-[620px] overflow-hidden">
        <MapContainer center={[17.6599, 75.9064]} zoom={13} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filtered.map((ward) => (
            <Polygon
              key={ward.id}
              positions={squareAround(ward.center)}
              pathOptions={{
                color: riskColor(ward.risk),
                fillColor: riskColor(ward.risk),
                fillOpacity: 0.35,
                weight: 2
              }}
            >
              <Tooltip direction="top" sticky>
                {ward.name} - Risk {Math.round(ward.risk * 100)}%
              </Tooltip>
            </Polygon>
          ))}
        </MapContainer>
      </Card>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-emerald-300">Safe</span>
        <span className="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-amber-300">Warning</span>
        <span className="rounded border border-red-500/40 bg-red-500/10 px-2 py-1 text-red-300">Danger</span>
        <span className="rounded border border-violet-500/40 bg-violet-500/10 px-2 py-1 text-violet-300">Critical</span>
      </div>
    </section>
  );
}

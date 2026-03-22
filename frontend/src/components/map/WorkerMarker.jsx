import { CircleMarker, Popup } from 'react-leaflet';
import { SEVERITY_COLORS } from '../../constants/colors';

export default function WorkerMarker({ worker, selected = false, onSelect }) {
  return (
    <CircleMarker
      center={worker.location}
      radius={selected ? 13 : worker.severity === 'CRITICAL' ? 11 : 8}
      pathOptions={{
        color: SEVERITY_COLORS[worker.severity],
        fillColor: SEVERITY_COLORS[worker.severity],
        fillOpacity: selected ? 0.95 : 0.7,
        weight: selected ? 3 : 2
      }}
      eventHandlers={{
        click: () => onSelect?.(worker.id)
      }}
    >
      <Popup>
        <div className="text-xs">
          <p className="font-semibold">{worker.name}</p>
          <p>{worker.id}</p>
          <p>Status: {worker.severity}</p>
        </div>
      </Popup>
    </CircleMarker>
  );
}

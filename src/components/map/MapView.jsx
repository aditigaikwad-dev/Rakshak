import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import Card from '../ui/Card';
import WorkerMarker from './WorkerMarker';

export default function MapView({ workers, selectedWorkerId, onSelectWorker }) {
  const selectedWorker = workers.find((worker) => worker.id === selectedWorkerId);

  return (
    <Card className="h-[520px] overflow-hidden" hover>
      <MapContainer
        center={selectedWorker?.location || [17.6599, 75.9064]}
        zoom={selectedWorker ? 15 : 14}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {workers.map((worker) => (
          <WorkerMarker
            key={worker.id}
            worker={worker}
            selected={worker.id === selectedWorkerId}
            onSelect={onSelectWorker}
          />
        ))}
      </MapContainer>
    </Card>
  );
}

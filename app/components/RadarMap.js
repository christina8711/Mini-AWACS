// /components/RadarMap.js
'use client';

import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function RadarMap({ plane, radarPoints }) {
  const planePosition = [plane.lat, plane.lon];

  return (
    <MapContainer center={planePosition} zoom={8} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={planePosition}>
        <Popup>
          <b>Plane Position</b><br />
          Lat: {plane.lat.toFixed(5)}<br />
          Lon: {plane.lon.toFixed(5)}<br />
          Alt: {plane.alt.toFixed(0)} m
        </Popup>
      </Marker>

      {radarPoints.map((p, i) => (
        <Circle
          key={i}
          center={[p.lat, p.lon]}
          radius={300}
          pathOptions={{ color: 'red' }}
        >
          <Popup>
            <b>Radar Target #{i + 1}</b><br />
            Lat: {p.lat.toFixed(5)}<br />
            Lon: {p.lon.toFixed(5)}<br />
            Alt: {p.alt.toFixed(0)} m<br />
            Azimuth: {p.azimuth.toFixed(1)}°<br />
            Elevation: {p.elevationAngle.toFixed(1)}°<br />
            Range: {p.range.toFixed(1)} km
          </Popup>
        </Circle>
      ))}
    </MapContainer>
  );
}

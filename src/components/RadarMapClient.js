// /components/RadarMapClient.js
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function RadarMapClient({ plane }) {
  const planePosition = [plane.lat, plane.lon];

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
      <MapContainer
        center={planePosition}
        zoom={8}
        scrollWheelZoom={true}
        zoomControl={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={planePosition}>
          <Popup>
            <b>Plane Position</b><br />
            Lat: {plane.lat.toFixed(5)}<br />
            Lon: {plane.lon.toFixed(5)}<br />
            Alt: {plane.alt.toFixed(0)} m
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

// /pages/radar.js
"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const RadarMap = dynamic(() => import('../components/RadarMap'), { ssr: false });

export default function RadarPage() {
  const [data, setData] = useState(null);
  const planeLat = 28.5;   // example: Orlando
  const planeLon = -81.2;
  const planeAlt = 10000;  // meters

  useEffect(() => {
    fetch(`/api/radar?lat=${planeLat}&lon=${planeLon}&alt=${planeAlt}`)
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div>Loading radar data...</div>;

  return (
    <div>
      <h1>Simulated Radar View</h1>
      <RadarMap plane={data.plane} radarPoints={data.radarPoints} />
    </div>
  );
}

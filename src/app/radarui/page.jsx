"use client";

import React, { useEffect, useState } from "react";
import { BackgroundGradient } from "@/components/background-gradient";

export default function LiveRadarPage() {
  const [objects, setObjects] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("Connecting to radar system...");
  const [error, setError] = useState(false);

  const fetchRadarData = async () => {
    try {
      const res = await fetch("/api/radar?lat=28.5&lon=-81.2&alt=10000");
      const data = await res.json();
      if (!Array.isArray(data.radarPoints)) throw new Error("Invalid data format");
      setObjects(data.radarPoints);
      setLastUpdated(`Last updated: ${new Date().toLocaleTimeString()}`);
      setError(false);
    } catch (err) {
      console.error("Radar data fetch failed", err);
      setObjects([]);
      setLastUpdated("❌ Radar data fetch failed");
      setError(true);
    }
  };

  useEffect(() => {
    fetchRadarData();
    const interval = setInterval(fetchRadarData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-screen text-green-400 font-[Orbitron] bg-black p-8">
      <h1 className="text-2xl mb-4">Live Radar Feed (Plain Text)</h1>

      <div className="bg-[#121215] p-6 rounded-xl shadow-lg max-w-3xl w-full mx-auto pointer-events-auto">
        {objects.length > 0 ? (
          <div className="space-y-4">
            {objects.map((obj, idx) => (
              <div key={idx} className="bg-black border border-green-800 p-4 rounded text-sm">
                <div>Type: {obj.type || "drone"}</div>
                <div>Azimuth: {obj.azimuth?.toFixed(2)}°</div>
                <div>Range: {obj.range?.toFixed(2)} NM</div>
                <div>Altitude: {obj.alt ? `${Math.round(obj.alt)} m` : "100 m"}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No radar data available.</p>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-400 text-center">{lastUpdated}</div>

      <div className="mt-12 flex justify-center">
        <BackgroundGradient className="rounded-[22px] w-full max-w-sm p-4 sm:p-10 bg-[#121215]">
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="w-full text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200 px-10 py-3 rounded-lg"
          >
            <span style={{ fontFamily: "'Orbitron', sans-serif" }}>Back to Dashboard</span>
          </button>
        </BackgroundGradient>
      </div>
    </div>
  );
}

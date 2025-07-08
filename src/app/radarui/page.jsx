"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { BackgroundGradient } from "@/components/background-gradient";

// Import the map without SSR (required for Leaflet)
const RadarMap = dynamic(() => import("../../components/RadarMapClient"), { ssr: false });

export default function LiveRadarPage() {
  const [objects, setObjects] = useState([]);
  const [mapData, setMapData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("Connecting to radar system...");
  const [error, setError] = useState(false);

  const fetchRadarData = async () => {
    try {
      const res = await fetch("/api/radar?lat=28.5&lon=-81.2&alt=10000");
      const data = await res.json();
      if (!Array.isArray(data.radarPoints)) throw new Error("Invalid data format");
      setObjects(data.radarPoints);
      setMapData(data);
      setLastUpdated(`Last updated: ${new Date().toLocaleTimeString()}`);
      setError(false);
    } catch (err) {
      console.error("Radar data fetch failed", err);
      setObjects([]);
      setMapData(null);
      setLastUpdated("❌ Radar data fetch failed");
      setError(true);
    }
  };

  useEffect(() => {
    fetchRadarData();
    const interval = setInterval(fetchRadarData, 1000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "drone":
        return "/images/drone-svgrepo-com.svg";
      case "aircraft":
        return "/images/aircraft-svgrepo-com.svg";
      case "bird":
        return "/images/pigeon-bird-peace-dove-svgrepo-com.svg";
      default:
        return null;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "drone":
        return "#00ff00";
      case "aircraft":
        return "#ffcc00";
      case "bird":
        return "#00bfff";
      default:
        return "white";
    }
  };

  return (
    <div className="relative min-h-screen w-screen text-green-400 font-[Orbitron] overflow-hidden">

      {/* Leaflet Map Background */}
      <div className="absolute inset-0 z-0">
        {mapData && <RadarMap plane={mapData.plane} radarPoints={mapData.radarPoints} />}
      </div>

      {/* Radar UI wrapper with pointer-events disabled */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pointer-events-none">



        <div
          id="radar"
          className="relative w-[500px] h-[500px] rounded-full border-2 border-green-500 overflow-hidden pointer-events-auto"
          style={{ background: "transparent" }}
        >
          <div
            className="absolute w-full h-full rounded-full z-0 animate-spin"
            style={{
              background: "conic-gradient(rgba(127, 255, 127, 0.4), transparent 20%)",
              animationDuration: "2s",
            }}
          ></div>

          {objects.map((obj, idx) => {
            const angleRad = (obj.azimuth * Math.PI) / 180;
            const distance = obj.range * 5;
            const x = 250 + distance * Math.cos(angleRad);
            const y = 250 - distance * Math.sin(angleRad);
            const icon = getIcon(obj.type || "drone");
            const color = getColor(obj.type || "drone");

            return (
              <div
                key={idx}
                className="absolute text-xs text-center"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 2,
                  textShadow: "0 0 3px black",
                }}
              >
                {icon && (
                  <Image
                    src={icon}
                    alt={obj.type || "Radar target"}
                    width={24}
                    height={24}
                    style={{ filter: `drop-shadow(0 0 2px ${color})` }}
                  />
                )}
                <div className="text-[10px] mt-1" style={{ color }}>
                  Alt: {Math.round(obj.alt)} m
                  <br />
                  Azimuth: {obj.azimuth.toFixed(1)}°
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-gray-300 text-sm pointer-events-auto">{lastUpdated}</div>

        {/* Dashboard Button */}
        <div className="mt-12 pointer-events-auto">
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
    </div>
  );
}

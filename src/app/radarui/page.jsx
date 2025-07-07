"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { BackgroundGradient } from "@/components/background-gradient";

export default function LiveRadarPage() {
  const [objects, setObjects] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("Connecting to radar system...");
  const [error, setError] = useState(false);

  const updateRadar = (data) => {
    if (!Array.isArray(data)) {
      setObjects([]);
      return;
    }
    setObjects(data);
    setLastUpdated(`Last updated: ${new Date().toLocaleTimeString()}`);
    setError(false);
  };

  const fetchRadarData = async () => {
    try {
      const res = await fetch("/radar-data");
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid data format");
      updateRadar(data);
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
    <div className="min-h-screen bg-black text-green-400 font-[Orbitron] flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-4 text-green-500">Live Radar Feed</h1>
      <div
        id="radar"
        className="relative w-[500px] h-[500px] rounded-full border-2 border-green-500 overflow-hidden"
        style={{ background: "radial-gradient(#121212 40%, #000 100%)" }}
      >
        <div
          className="absolute w-full h-full rounded-full z-0 animate-spin"
          style={{
            background:
              "conic-gradient(rgba(127, 255, 127, 0.41), transparent 20%)",
            animationDuration: "2s",
          }}
        ></div>

        {objects.map((obj, idx) => {
          const angleRad = (obj.angle * Math.PI) / 180;
          const x = 250 + obj.distance * Math.cos(angleRad);
          const y = 250 - obj.distance * Math.sin(angleRad);
          const icon = getIcon(obj.type);
          const color = getColor(obj.type);

          return (
            <div
              key={idx}
              className="absolute text-white text-xs text-center object"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: "translate(-50%, -50%)",
                zIndex: 2,
              }}
            >
              {icon && (
                <Image
                  src={icon}
                  alt={obj.type}
                  width={24}
                  height={24}
                  style={{ filter: `drop-shadow(0 0 2px ${color})` }}
                />
              )}
              <div className="text-[10px] mt-1" style={{ color }}>
                Speed: {obj.speed} kts
                <br />Alt: {obj.altitude} ft
              </div>
            </div>
          );
        })}
      </div>

      <div id="statusBar" className="mt-4 text-gray-300 text-sm">
        {lastUpdated || "Connecting to radar system..."}
      </div>

      <div className="mt-6 text-white">
        <h2 className="text-lg font-bold mb-2">Legend</h2>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Image
              src="/images/drone-svgrepo-com.svg"
              alt="Drone"
              width={20}
              height={20}
              style={{ backgroundColor:"#00ff00" }}
            />
            <span className="text-green-400 text-sm">Drone</span>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/images/aircraft-svgrepo-com.svg"
              alt="Aircraft"
              width={20}
              height={20}
              style={{ backgroundColor:"#ffcc00" }}
            />
            <span className="text-yellow-300 text-sm">Aircraft</span>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/images/pigeon-bird-peace-dove-svgrepo-com.svg"
              alt="Bird"
              width={20}
              height={20}
              style={{ backgroundColor:"#00bfff" }}
            />
            <span className="text-blue-300 text-sm">Bird</span>
          </div>
        </div>
      </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
          <div className="col-span-full flex justify-center">
            <BackgroundGradient className="rounded-[22px] w-full max-w-sm p-4 sm:p-10 bg-[#121215]">
              <button  onClick={() => (window.location.href = "/dashboard")}
                className="w-full text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200 px-10 py-3 rounded-lg"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                  <svg
                  className="h-10 w-10 justify-center ml-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>

                <span style={{ fontFamily: "'Orbitron', sans-serif" }}>Back to Dashboard</span>
              </button>
            </BackgroundGradient>
          </div>
        </div>
    </div>
  );
}

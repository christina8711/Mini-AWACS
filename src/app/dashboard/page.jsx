"use client";

import React from "react";
import { BackgroundBeams } from "@/components/background-beams";
import { BackgroundGradient } from "@/components/background-gradient";

export default function DashboardPage() {
  return (
    <>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500&family=Roboto:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
       <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <BackgroundBeams />
      <div className="relative z-10 p-12 text-center">
        <h1 className="text-4xl text-gold"
        style={{ fontFamily: "'Orbitron', sans-serif" }}>
          Welcome to the Mini-AWACS Dashboard
        </h1>
        <p className="text-gray-400 mt-4 font-roboto">
          Real-time radar interface to monitor, control, and analyze your radar feed
        </p>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            <div className="col-span-full flex justify-center">
              <BackgroundGradient className="rounded-[22px] w-full max-w-sm p-4 sm:p-10 bg-[#121215]">
                <button
                  onClick={() => (window.location.href = "/radarui")}
                  className="w-full text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200 px-10 py-3 rounded-lg"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  Live Radar View
                </button>
              </BackgroundGradient>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            <div className="col-span-full flex justify-center">
              <BackgroundGradient className="rounded-[22px] w-full max-w-sm p-4 sm:p-10 bg-[#121215]">
                <button
                  className="w-full text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200 px-10 py-3 rounded-lg"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  Scan Reports 
                </button>
              </BackgroundGradient>
            </div>
          </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            <div className="col-span-full flex justify-center">
              <BackgroundGradient className="rounded-[22px] w-full max-w-sm p-4 sm:p-10 bg-[#121215]">
                <button
                  className="w-full text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200 px-10 py-3 rounded-lg"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  Control Panel
                </button>
              </BackgroundGradient>
            </div>
          </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            <div className="col-span-full flex justify-center">
              <BackgroundGradient className="rounded-[22px] w-full max-w-sm p-4 sm:p-10 bg-[#121215]">
                <button  onClick={() => (window.location.href = "/")}
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

                  <span style={{ fontFamily: "'Orbitron', sans-serif" }}>Logout</span>
                </button>
              </BackgroundGradient>
            </div>
          </div>
      </div>
    </main>
    </>
   
  );
}

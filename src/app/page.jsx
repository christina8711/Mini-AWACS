"use client";

import { useEffect } from "react";
import { attachLoginHandler } from "@/components/login";

export default function LoginPage() {
  useEffect(() => {
    attachLoginHandler();
  }, []);

  return (
    <>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500&family=Roboto:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>

      <main
        className="bg-[url('/images/Bg-Image.png')] bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center px-4 text-white"
        style={{ fontFamily: "'Roboto', sans-serif" }}
      >
        <div className="grid grid-rows-[auto_1fr] gap-6 w-full max-w-md">
          <div className="flex justify-center">
            <img
              src="/images/Company-Logo.svg"
              alt="Company Logo"
              className="h-auto w-auto"
            />
          </div>

          <div className="bg-white/5 backdrop-blur-md p-8 rounded-lg shadow-xl">
            <h1
              className="text-3xl text-center mb-6"
              style={{ fontFamily: "'Orbitron', sans-serif", color: "#F2B442" }}
            >
              Login
            </h1>

            <form className="space-y-6" id="loginForm">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:ring focus:ring-yellow-300 focus:border-yellow-400"
                  placeholder="name@military.net"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Your password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:ring focus:ring-yellow-300 focus:border-yellow-400"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 text-sm font-medium text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm hover:underline"
                  style={{ color: "#F2B442" }}
                >
                  Forgot password?
                </a>
              </div>

                <button
                  type="submit"
                  className="w-full text-black bg-[#F2B442] hover:bg-yellow-400 font-bold rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-300"
                >
                  Log In
                </button>


              <p className="text-sm font-light text-gray-400 text-center">
                Don’t have an account?{" "}
                <a
                  href="#"
                  className="font-medium hover:underline"
                  style={{ color: "#F2B442" }}
                >
                  Request One
                </a>
              </p>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

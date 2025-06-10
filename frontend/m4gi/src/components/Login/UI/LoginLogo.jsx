"use client";
import React from "react";

export default function LoginLogo() {
  return (
    <div className="text-center mb-8">
      <header className="z-50 flex flex-row justify-center items-center px-4 relative mb-4 mx-auto w-96">
        {/* 반짝이는 효과들 */}
        <div className="sparkle-effect absolute top-2 left-5 text-lg">
          ✨
        </div>
        <div className="sparkle-effect sparkle-delay-700 absolute top-7 right-8 text-lg">
          ⭐
        </div>

        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/ad4d10228d0c6f1b0e8c1d8439f170e2c8151c78?placeholderIfAbsent=true&apiKey=e63d00b6fe174365bf8642989b3e5edd"
          alt="Campia Logo"
          className="w-24 aspect-[1.09] object-contain logo-glow"
        />

        <div className="flex flex-col items-start ml-3">
          <h1 className="text-white text-6xl font-bold leading-none text-glow">
            Campia
          </h1>
        </div>

        {/* 추가 장식 요소들 */}
        <div className="absolute -top-2 -right-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
        </div>
        <div className="absolute -bottom-2 -left-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        </div>
      </header>
    </div>
  );
}

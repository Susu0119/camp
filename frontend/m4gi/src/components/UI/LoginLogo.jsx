import React from "react";

export default function LoginLogo() {
  return (
    <header className="flex relative gap-1 self-center text-6xl whitespace-nowrap w-[351px]">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/ad4d10228d0c6f1b0e8c1d8439f170e2c8151c78?placeholderIfAbsent=true&apiKey=e63d00b6fe174365bf8642989b3e5edd"
        alt="Campia Logo"
        className="object-contain shrink-0 rounded-none aspect-[1.09] w-[98px]"
      />
      <h1 className="flex-auto w-[230px] text-white">
        Campia
      </h1>
    </header>
  );
}
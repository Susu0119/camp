import React from "react";
import ProfileButton from "../../Common/ProfileButton";

export default function MPHeader() {
  return (
    <header className="flex justify-between items-center px-12 w-full bg-white min-h-[100px] shadow-[0px_2px_4px_rgba(0,0,0,0.1)]">
      {/* 로고 */}
      <div className="flex gap-2.5 select-none font-['GapyeongWave'] items-center text-4xl text-cpurple whitespace-nowrap">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/ac1e1903cdffe41cf50fd0a5d741c49309973b46?placeholderIfAbsent=true"
          alt="Campia Logo"
          className="object-contain w-[59px]"
        />
        <h1>Campia</h1>
      </div>

      {/* 종 아이콘 + 프로필 버튼 */}
      <div className="flex items-center gap-6">
        {/* 종 아이콘 */}
        <button aria-label="Notifications" className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-cpurple"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            3
          </span>
        </button>

        {/* 프로필 버튼 */}
        <ProfileButton />
      </div>
    </header>
  );
}

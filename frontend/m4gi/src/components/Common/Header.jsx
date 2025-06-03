import React from "react";
import SearchBar from "../Main/UI/SearchBar";
import ProfileButton from "./ProfileButton";
import { NotificationIcon } from "../Main/UI/NotificationIcon";

export default function Header({ showSearchBar = true }) {
  return (
    <header className="w-full bg-white min-h-[100px] shadow-[0px_2px_4px_rgba(0,0,0,0.1)] flex justify-center px-4">
      
      {/* 가운데 정렬을 위한 wrapper */}
      <div className="flex items-center gap-10 w-full max-w-[1400px]">

        {/* 로고 */}
        <div className="flex gap-6 select-none font-['GapyeongWave'] items-center text-4xl text-cpurple whitespace-nowrap flex-shrink-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/ac1e1903cdffe41cf50fd0a5d741c49309973b46?placeholderIfAbsent=true"
            alt="Campia Logo"
            className="object-contain w-[55px] aspect-[1.09]"
          />
          <h1 className="text-cpurple">Campia</h1>
        </div>

        {/* 검색창 */}
        {showSearchBar && (
          <div className="flex items-center flex-grow max-w-[1100px]">
            <SearchBar />
          </div>
        )}

        {/* 알림/프로필 아이콘 */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            aria-label="Notifications"
            className="rounded-full w-11 h-11 flex items-center justify-center"
            style={{ backgroundColor: "#F4E7F7" }}
          >
            <NotificationIcon strokeWidth={1} className="w-6 h-6 text-black" />
          </button>
          <ProfileButton className="ml-2" />
        </div>

      </div>
    </header>
  );
}

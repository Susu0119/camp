import React from "react";
import SearchBar from "../../Main/UI/SearchBar";
import ProfileButton from "../../Common/ProfileButton";
import { NotificationIcon } from "../../Main/UI/NotificationIcon";

export default function Header({ showSearchBar = false }) {
 const header = showSearchBar
  ? "flex gap-6 justify-between items-center px-12 w-full bg-white min-h-[100px] shadow-[0px_2px_4px_rgba(0,0,0,0.1)]"
  : "flex gap-10 justify-between px-12 w-full bg-white min-h-[100px] shadow-[0px_2px_4px_rgba(0,0,0,0.1)]";

  return (
    <header className={header}>
     <div className="flex gap-2.5 select-none font-['GapyeongWave'] items-center my-auto text-4xl text-cpurple whitespace-nowrap flex-shrink-0">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/ac1e1903cdffe41cf50fd0a5d741c49309973b46?placeholderIfAbsent=true"
          alt="Campia Logo"
          className="object-contain shrink-0 self-stretch my-auto rounded-none aspect-[1.09] w-[59px]"
        />
        <h1 className="self-stretch my-auto text-cpurple">Campia</h1>
      </div>

      {showSearchBar && (
    <div className="flex items-center gap-4 flex-grow max-w-3xl">
    <SearchBar />
    </div>
      )}


   <div className="flex items-center gap-4">
    <button
      aria-label="Notifications"
       className="rounded-full w-12 h-12 flex items-center justify-center"
      style={{ backgroundColor: "#F4E7F7" }}
    >
      <NotificationIcon strokeWidth={1} className="w-6.5 h-6.5 text-black" />
    </button>   

      <ProfileButton className="ml-6" />
      </div>
    </header>
  );
}

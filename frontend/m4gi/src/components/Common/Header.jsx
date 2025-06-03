import React from "react";
import SearchBar from "../Main/UI/SearchBar";
import ProfileButton from "./ProfileButton";
import NotificationsIcon from '@mui/icons-material/Notifications';

// showSearchBar prop을 추가하고 기본값을 true로 설정합니다.
export default function Header({ showSearchBar = true }) {
    const header = showSearchBar
        ? "flex gap-10 justify-center items-center px-12 w-full bg-white min-h-[100px] shadow-[0px_2px_4px_rgba(0,0,0,0.1)]"
        : "flex gap-10 justify-between px-12 w-full bg-white min-h-[100px] shadow-[0px_2px_4px_rgba(0,0,0,0.1)]"
    return (
        <header className={header}>
            <div className="flex gap-2.5 select-none font-['GapyeongWave'] items-center self-stretch my-auto text-4xl text-cpurple whitespace-nowrap">
                
                <img
                    src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/ac1e1903cdffe41cf50fd0a5d741c49309973b46?placeholderIfAbsent=true"
                    alt="Campia Logo"
                    className="object-contain shrink-0 self-stretch my-auto rounded-none aspect-[1.09] w-[59px]"
                />
                <h1 className="self-stretch my-auto text-cpurple">Campia</h1>
            </div>

            {/* showSearchBar prop이 true일 때만 SearchBar를 렌더링합니다. */}
            {showSearchBar && <SearchBar />}

            <div className="flex items-center gap-4">
                <div className="flex items-center justify-center bg-clpurple w-10 h-10 rounded-full">
                    <NotificationsIcon />
                </div>
                <ProfileButton/>
            </div>
        </header>
    );
}
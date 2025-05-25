import React from "react";
import SearchBar from "../Main/UI/SearchBar";

// showSearchBar prop을 추가하고 기본값을 true로 설정합니다.
export default function Header({ showSearchBar = true }) {
    const header = showSearchBar
        ? "flex gap-10 justify-center items-center px-12 w-full bg-white min-h-[100px] shadow-[0px_2px_4px_rgba(0,0,0,0.1)]"
        : "flex gap-10 justify-between px-12 w-full bg-white min-h-[100px] shadow-[0px_2px_4px_rgba(0,0,0,0.1)]"
    return (
        <header className={header}>
            <div className="flex gap-2.5 select-none font-['Gapyeong_Wave'] items-center self-stretch my-auto text-4xl text-cpurple whitespace-nowrap">
                <img
                    src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/ac1e1903cdffe41cf50fd0a5d741c49309973b46?placeholderIfAbsent=true"
                    alt="Campia Logo"
                    className="object-contain shrink-0 self-stretch my-auto rounded-none aspect-[1.09] w-[59px]"
                />
                <h1 className="self-stretch my-auto text-cpurple">Campia</h1>
            </div>

            {/* showSearchBar prop이 true일 때만 SearchBar를 렌더링합니다. */}
            {showSearchBar && <SearchBar />}

            <div className="flex gap-5 items-center self-stretch my-auto">
                <button className="flex overflow-hidden gap-2.5 items-center self-stretch p-4 my-auto h-12 bg-[#EDDDF4] bg-opacity-10 rounded-[90px] w-[47px]">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/47f02f1ff6983d29a5eea4cf884c454f54375d52?placeholderIfAbsent=true"
                        alt="Notification"
                        className="object-contain self-stretch my-auto aspect-[0.94] w-[17px]"
                    />
                </button>
                <div className="flex gap-5 justify-center items-center self-stretch px-4 py-2 my-auto bg-gray-200 rounded-[50px]">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/b1024f687032e52ece02b8a056563b85dc471ea7?placeholderIfAbsent=true"
                        alt="Menu"
                        className="object-contain shrink-0 self-stretch my-auto aspect-[0.92] w-[22px]"
                    />
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/ead1847b3130b18aa9d45c1baaf72dc4f26b1228?placeholderIfAbsent=true"
                        alt="Profile"
                        className="object-contain shrink-0 self-stretch my-auto aspect-square w-[35px]"
                    />
                </div>
            </div>
        </header>
    );
}
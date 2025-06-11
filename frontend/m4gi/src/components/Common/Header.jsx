// src/components/Header/Header.js
import React, { useState, useRef, useEffect } from "react";
import SearchBar from "../Main/UI/SearchBar";
import ProfileButton from "./ProfileButton";
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationModal from "../MyPage/UI/NotificationModal";

export default function Header({ showSearchBar = true }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const notificationRef = useRef(null); // 알림 아이콘과 모달을 감싸는 div의 ref

    const headerClass = showSearchBar
        ? "flex gap-10 justify-center items-center px-12 w-full bg-white min-h-[100px] shadow-[0px_2px_4px_rgba(0,0,0,0.1)]"
        : "flex gap-10 justify-between px-12 w-full bg-white min-h-[100px] shadow-[0px_2px_4px_rgba(0,0,0,0.1)]";

    // 모달 외부 클릭 시 닫히도록 하는 useEffect
    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsModalOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [notificationRef]);
    
    return (
        <header className={headerClass + " relative"}> {/* position: relative 추가 */}
            <div className="flex gap-2.5 select-none font-['GapyeongWave'] items-center self-stretch my-auto text-4xl text-cpurple whitespace-nowrap">
                <img
                    src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/ac1e1903cdffe41cf50fd0a5d741c49309973b46?placeholderIfAbsent=true"
                    alt="Campia Logo"
                    className="object-contain shrink-0 self-stretch my-auto rounded-none aspect-[1.09] w-[59px]"
                />
                <h1 className="self-stretch my-auto text-cpurple">Campia</h1>
            </div>

            {showSearchBar && <SearchBar />}

            <div className="flex items-center gap-4">
                {/* 알림 아이콘과 모달을 포함하는 상대 위치 컨테이너 */}
                <div className="relative" ref={notificationRef}>
                    <div 
                        className="flex items-center justify-center bg-clpurple w-10 h-10 rounded-full cursor-pointer"
                        onClick={() => setIsModalOpen(prev => !prev)} // 클릭 시 모달 상태 토글
                    >
                        <NotificationsIcon />
                    </div>
                    {isModalOpen && <NotificationModal />} {/* 상태에 따라 모달 렌더링 */}
                </div>
                <ProfileButton />
            </div>
        </header>
    );
}
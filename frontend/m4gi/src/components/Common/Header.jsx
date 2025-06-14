// src/components/Header/Header.js
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../Main/UI/SearchBar";
import ProfileButton from "./ProfileButton";
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationModal from "../MyPage/UI/NotificationModal";
import { useAuth } from "../../utils/Auth";

export default function Header({ showSearchBar = true }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const notificationRef = useRef(null);
    const navigate = useNavigate();
    
    // AuthContext에서 인증 상태 및 로딩 상태 가져오기
    const { isAuthenticated, isLoading: isLoadingAuth } = useAuth(); // AuthProvider의 isLoading 사용

    const headerClass = showSearchBar
        ? "flex gap-10 justify-center items-center px-12 w-full bg-white min-h-[100px] shadow-[0px_2px_4px_rgba(0,0,0,0.1)]"
        : "flex gap-10 justify-between px-12 w-full bg-white min-h-[100px] shadow-[0px_2px_4px_rgba(0,0,0,0.1)]";

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

    // Header에서는 이제 별도의 사용자 정보 fetch 로직이 필요 없습니다.
    // user 정보는 AuthContext에서 관리됩니다.

    return (
        <header className={headerClass + " relative"}>
            <div
                className="flex gap-2.5 select-none font-['GapyeongWave'] items-center self-stretch my-auto text-4xl text-cpurple whitespace-nowrap cursor-pointer"
                onClick={() => navigate("/main")}
            >
                <img
                    src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/ac1e1903cdffe41cf50fd0a5d741c49309973b46?placeholderIfAbsent=true"
                    alt="Campia Logo"
                    className="object-contain shrink-0 self-stretch my-auto rounded-none aspect-[1.09] w-[59px]"
                />
                <h1 className="self-stretch my-auto text-cpurple">Campia</h1>
            </div>

            {showSearchBar && <SearchBar />}

            <div className="flex items-center gap-4">
                <div className="relative" ref={notificationRef}>
                    <div
                        className="flex items-center justify-center bg-clpurple w-10 h-10 rounded-full cursor-pointer"
                        onClick={() => setIsModalOpen(prev => !prev)}
                    >
                        <NotificationsIcon />
                    </div>
                    {/* 모달 렌더링 조건: isModalOpen이 true이고, 인증 로딩 중이 아닐 때 */}
                    {isModalOpen && !isLoadingAuth && <NotificationModal />} 
                    
                    {/* 인증 로딩 중일 때 로딩 메시지 (선택 사항) */}
                    {isModalOpen && isLoadingAuth && ( 
                        <div className="absolute top-full right-0 mt-4 w-[450px] bg-[#FDF4FF] rounded-xl shadow-2xl z-10 p-5 text-center">
                            <p className="text-gray-600">사용자 인증 정보 확인 중...</p>
                        </div>
                    )}
                </div>
                <ProfileButton />
            </div>
        </header>
    );
}
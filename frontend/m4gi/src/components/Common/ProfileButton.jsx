import React, { useState, useEffect } from 'react';
import MyList from './MyList';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../utils/Auth.jsx';

export default function ProfileButton() {
    const [open, setOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    
    // AuthProvider로부터 인증 상태와 사용자 정보, 로딩 상태를 가져옵니다.
    const { user, isAuthenticated, loading } = useAuth();

    const handleClick = () => {
        setOpen(!open);
    };

    // 사용자 정보가 변경되면 프로필 이미지 상태 업데이트
    useEffect(() => {
        if (user && user.profileImage) {
            setProfileImage(user.profileImage);
        } else {
            setProfileImage(null);
        }
    }, [user]);

    // 더 이상 커스텀 이벤트 리스너가 필요 없음
    // useAuth의 user 상태가 변경되면 자동으로 useEffect가 실행되어 프로필 이미지 업데이트됨
    
    return (
        <div className="relative flex items-center">
            <div 
                className="flex select-none items-center bg-[#ececec] rounded-full h-[49px] w-[107px] px-[15px] py-[7px] gap-[20px] cursor-pointer"
                onClick={handleClick}
            >
                <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.75 18V16H19.25V18H2.75ZM2.75 13V11H19.25V13H2.75ZM2.75 8V6H19.25V8H2.75Z" fill="#141414" />
                </svg>
                
                {/* 로딩 중이거나, 인증되지 않았거나, 프로필 이미지가 없는 경우 기본 아이콘 표시 */}
                {loading ? (
                    <AccountCircleIcon fontSize="large" /> 
                ) : (isAuthenticated && profileImage) ? (
                    <img 
                        src={profileImage}
                        alt="프로필 이미지" 
                        className="w-[35px] h-[35px] rounded-full object-cover"
                        onError={() => setProfileImage(null)} // 이미지 로드 실패 시 기본 아이콘으로 변경
                    />
                ) : (
                    <AccountCircleIcon fontSize="large" />
                )}
            </div>
            {open && <MyList />} 
        </div>
    );
};
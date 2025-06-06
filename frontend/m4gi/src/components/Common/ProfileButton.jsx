import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyList from './MyList';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../utils/Auth.jsx';

export default function ProfileButton() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    // AuthProvider로부터 인증 상태와 사용자 정보, 로딩 상태를 가져옵니다.
    const { user, isAuthenticated, loading } = useAuth();

    console.log('=== ProfileButton 디버깅 ===');
    console.log('loading:', loading);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user:', user);
    console.log('user type:', typeof user);
    console.log('===============================');

    const handleClick = () => {
        if (isAuthenticated) {
            setOpen(!open);
        } else {
            // 로그인하지 않은 상태면 로그인 페이지로 이동
            navigate('/login');
        }
    };

    // 로그인하지 않은 상태이거나 로딩 중일 때 로그인 버튼 렌더링
    if (!isAuthenticated) {
        return (
            <div className="relative flex items-center">
                <button
                    className="flex select-none items-center justify-center bg-cpurple text-white rounded-full h-[49px] w-[107px] px-[15px] py-[7px] cursor-pointer hover:opacity-90"
                    onClick={handleClick}
                >
                    로그인
                </button>
            </div>
        );
    }

    // 로그인한 상태일 때 기존 프로필 버튼 렌더링
    return (
        <div className="relative flex items-center">
            <div
                className="flex select-none items-center bg-[#ececec] rounded-full h-[49px] w-[107px] px-[15px] py-[7px] gap-[20px] cursor-pointer"
                onClick={handleClick}
            >
                <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.75 18V16H19.25V18H2.75ZM2.75 13V11H19.25V13H2.75ZM2.75 8V6H19.25V8H2.75Z" fill="#141414" />
                </svg>

                {/* 사용자 정보가 있고 프로필 이미지가 있는 경우 프로필 이미지, 없으면 기본 아이콘 표시 */}
                {(user && user.profileImage) ? (
                    <img
                        src={user.profileImage}
                        alt="프로필 이미지"
                        className="w-[35px] h-[35px] rounded-full object-cover"
                    />
                ) : (
                    <AccountCircleIcon fontSize="large" />
                )}
            </div>
            {open && <MyList />}
        </div>
    );
};
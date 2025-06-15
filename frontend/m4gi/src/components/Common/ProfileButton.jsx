import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyList from './MyList';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../utils/Auth.jsx';

export default function ProfileButton() {
    const [open, setOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const navigate = useNavigate();

    // AuthProvider로부터 인증 상태와 사용자 정보, 로딩 상태를 가져옵니다.
    const { user, isAuthenticated, loading } = useAuth();

    // 사용자 정보가 변경되면 프로필 이미지 상태를 동기화합니다.
    useEffect(() => {
        if (user && user.profileImage) {
            setProfileImage(user.profileImage);
        } else {
            setProfileImage(null);
        }
    }, [user]); // user 객체가 바뀔 때마다 실행

    const handleClick = () => {
        // 로그인 상태이면 메뉴를 열고, 아니면 로그인 페이지로 이동합니다.
        if (isAuthenticated) {
            setOpen(!open);
        } else {
            navigate('/login');
        }
    };

    // 로딩 중일 때는 아무것도 표시하지 않거나 로딩 스피너를 표시할 수 있습니다.
    if (loading) {
        return (
            <div className="flex items-center justify-center h-[49px] w-[107px]">
                {/* 로딩 스피너 등을 여기에 추가할 수 있습니다. */}
            </div>
        );
    }

    // 로그인하지 않은 상태일 때 "로그인" 버튼을 렌더링합니다.
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

    // 로그인한 상태일 때 프로필 버튼을 렌더링합니다.
    return (
        <div className="relative flex items-center">
            <div
                className="flex select-none items-center bg-[#ececec] rounded-full h-[49px] w-[107px] px-[15px] py-[7px] gap-[20px] cursor-pointer"
                onClick={handleClick}
            >
                <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.75 18V16H19.25V18H2.75ZM2.75 13V11H19.25V13H2.75ZM2.75 8V6H19.25V8H2.75Z" fill="#141414" />
                </svg>
                
                {/* 프로필 이미지가 있으면 이미지를, 없으면 기본 아이콘을 표시합니다. */}
                {profileImage ? (
                    <img
                        src={profileImage}
                        alt="프로필 이미지"
                        className="w-[35px] h-[35px] rounded-full object-cover"
                        // 이미지 로드 실패 시 profileImage 상태를 null로 바꿔 기본 아이콘이 보이게 합니다.
                        onError={() => setProfileImage(null)} 
                    />
                ) : (
                    <AccountCircleIcon fontSize="large" />
                )}
            </div>
            {open && <MyList />}
        </div>
    );
};

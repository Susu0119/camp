import React, { useState, useEffect } from 'react';
import MyList from './MyList';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import { Auth } from '../../utils/Auth.jsx';

export default function ProfileButton() {
    const [open, setOpen] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    
    useEffect(() => {
        // 로그인 상태 확인 및 사용자 정보 가져오기
        const checkLoginStatus = async () => {
            const token = Auth.getToken();
            
            if (token) {
                try {
                    const response = await axios.post('/web/oauth/kakao/status', {}, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (response.data.isLoggedIn && response.data.user) {
                        // 사용자 정보 업데이트
                        Auth.setUserInfo(response.data.user);
                        setUserProfile(response.data.user.profileImage);
                    }
                } catch (error) {
                    console.error('로그인 상태 확인 실패:', error);
                    Auth.logout(); // 오류 발생 시 로그아웃 처리
                }
            }
        };
        
        checkLoginStatus();
    }, []);
    
    const handleClick = () => {
        setOpen(!open);
    };
    
    return (
        <div className="relative">
            <div 
                className="flex select-none items-center bg-[#ececec] rounded-full h-[49px] w-[107px] px-[15px] py-[7px] gap-[20px] cursor-pointer"
                onClick={handleClick}
            >
                <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.75 18V16H19.25V18H2.75ZM2.75 13V11H19.25V13H2.75ZM2.75 8V6H19.25V8H2.75Z" fill="#141414" />
                </svg>
                
                {userProfile ? (
                    <img 
                        src={userProfile} 
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
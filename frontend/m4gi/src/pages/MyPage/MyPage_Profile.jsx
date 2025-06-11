// MyPageProfilePage.jsx

"use client";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MPSidebar from "../../components/MyPage/UI/MP_SideBar";
import Header from '../../components/Common/Header.jsx';
import ProfileForm from '../../components/MyPage/UI/MP_ProfileForm';
import { useAuth } from '../../utils/Auth.jsx';

export default function MyPageProfilePage() {
  const [providerCode, setProviderCode] = useState('');
  const [providerUserId, setProviderUserId] = useState('');
  // currentNickname의 초기값을 빈 문자열로 설정하고, API 호출로 채웁니다.
  const [currentNickname, setCurrentNickname] = useState(''); 
  const navigate = useNavigate();

  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
    if (isAuthenticated && user) {
      const pCode = user.providerCode || '';
      const pUserId = user.providerUserId || '';
      setProviderCode(pCode);
      setProviderUserId(pUserId);

      // ✅ 1. providerCode와 providerUserId가 있으면 최신 사용자 정보를 불러옵니다.
      if (pCode && pUserId) {
        const fetchUserProfile = async () => {
          try {
            const response = await fetch(`/web/api/user/mypage/${pCode}/${pUserId}`);
            if (!response.ok) {
              throw new Error('사용자 정보 로딩 실패');
            }
            const data = await response.json();
            // ✅ 2. 서버에서 받은 최신 닉네임으로 상태를 업데이트합니다.
            setCurrentNickname(data.nickname || ''); 
          } catch (error) {
            console.error(error);
            // 에러 처리 (예: 알림 표시)
          }
        };
        fetchUserProfile();
      }
    }
  }, [isLoading, isAuthenticated, user, navigate]); // 의존성 배열에 user와 navigate 추가

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Line+Seed+Sans+KR:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <div className="h-screen flex flex-col bg-white">
        <Header showSearchBar={false} />
        <div className="flex flex-1">
          <MPSidebar />
          <div className="flex-1 flex flex-col">
            {/* currentNickname이 성공적으로 로드되면 ProfileForm이 올바른 값으로 렌더링됩니다. */}
            <ProfileForm
              currentNickname={currentNickname}
              providerCode={providerCode}
              providerUserId={providerUserId}
            />
          </div>
        </div>
      </div>
    </>
  );
}
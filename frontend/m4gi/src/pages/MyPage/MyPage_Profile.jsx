"use client";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MPSidebar from "../../components/MyPage/UI/MP_SideBar";
import MPHeader from "../../components/MyPage/UI/MP_Header";
import ProfileForm from '../../components/MyPage/UI/MP_ProfileForm';
import { useAuth } from '../../utils/Auth.jsx';

export default function MyPageProfilePage() {
  const [providerCode, setProviderCode] = useState('');
  const [providerUserId, setProviderUserId] = useState('');
  const [currentNickname, setCurrentNickname] = useState('');
  const navigate = useNavigate();

  // useAuth 훅을 사용해서 사용자 정보 가져오기
  const { user, isAuthenticated, isLoading } = useAuth();


  useEffect(() => {
    // 사용자가 로그인되어 있고 사용자 정보가 있을 때 상태 업데이트
    if (isAuthenticated && user) {
      setProviderCode(user.providerCode || '');
      setProviderUserId(user.providerUserId || '');
      setCurrentNickname(user.nickname || '');
    }
  }, [isAuthenticated, user]);

  // 로딩이 완료되고 로그인하지 않은 경우 로그인 페이지로 리디렉션
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Line+Seed+Sans+KR:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <main className="flex min-h-screen bg-white max-sm:flex-col">
        <MPSidebar />
        <div className="flex flex-col flex-1">
          <MPHeader />
          <ProfileForm
            currentNickname={currentNickname}
            providerCode={providerCode}
            providerUserId={providerUserId}
          />
        </div>
      </main>
    </>
  );
};
"use client";
import React, { useEffect, useState } from 'react';
import MPSidebar from "../../components/MyPage/UI/MP_SideBar";
import MPHeader from "../../components/MyPage/UI/MP_Header";
import ProfileForm from '../../components/MyPage/UI/MP_ProfileForm';

const MyPageProfilePage = () => {
  const [providerCode, setProviderCode] = useState('');
  const [providerUserId, setProviderUserId] = useState('');
  const [currentNickname, setCurrentNickname] = useState('');

  useEffect(() => {
    // ✅ 예시: localStorage 또는 sessionStorage에서 값 가져오기
    const storedProviderCode = localStorage.getItem('providerCode') || '';
    const storedProviderUserId = localStorage.getItem('providerUserId') || '';
    const storedNickname = localStorage.getItem('nickname') || '';

    setProviderCode(storedProviderCode);
    setProviderUserId(storedProviderUserId);
    setCurrentNickname(storedNickname);
  }, []);

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

export default MyPageProfilePage;

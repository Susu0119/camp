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

  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      setProviderCode(user.providerCode || '');
      setProviderUserId(user.providerUserId || '');
      setCurrentNickname(user.nickname || '');
    }
  }, [isAuthenticated, user]);

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
      <div className="h-screen flex flex-col bg-white">
        <MPHeader />
        <div className="flex flex-1">
          <MPSidebar />
          <div className="flex-1 flex flex-col">
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

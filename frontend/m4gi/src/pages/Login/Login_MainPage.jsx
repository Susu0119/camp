"use client";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/Auth";
import BackgroundContainer from "../../components/Login/UI/BackgroundContainer";
import LoginLogo from "../../components/Login/UI/LoginLogo";
import LoginForm from "../../components/Login/UI/LoginForm";

export default function Login_MainPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // 로딩이 완료되고 이미 인증된 상태라면 /main으로 리다이렉트
    if (!isLoading && isAuthenticated) {
      navigate('/main');
    }
  }, [isAuthenticated, isLoading]);


  // 인증되지 않은 경우에만 로그인 화면 표시
  return (
    <BackgroundContainer>
      {/* 로그인 화면 */}
      <div className="h-screen w-full flex flex-col items-center justify-start pt-20 p-8">
        {/* 로고 섹션 */}
        <div className="mb-8 z-50">
          <LoginLogo />
        </div>

        {/* 로그인 폼 섹션 */}
        <div className="z-[100] w-full max-w-[500px]">
          <LoginForm />
        </div>
      </div>
    </BackgroundContainer>
  );
}

"use client";
import React, { useEffect } from "react";
import BackgroundContainer from "../../components/Login/UI/BackgroundContainer"
import LoginForm from "../../components/Login/UI/LoginForm";
import LoginLogo from "../../components/Login/UI/LoginLogo";

export default function LoginMainPage() {
  useEffect(() => {
    console.log("✅ REST KEY:", import.meta.env.VITE_KAKAO_REST_KEY);
    console.log("✅ REDIRECT URI:", import.meta.env.VITE_KAKAO_REDIRECT_URI);
  }, []);


  return (
    <BackgroundContainer>
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        {/* 로고 */}
        <div className="mb-12">
          <LoginLogo />
        </div>

        {/* 로그인 폼 */}
        <LoginForm />
      </div>
    </BackgroundContainer>
  );
}

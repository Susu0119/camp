"use client";
import React, { useEffect } from "react";
import BackgroundContainer from "../UI/BackgroundContainer";
import LoginForm from "../UI/LoginForm";
import LoginLogo from "../UI/LoginLogo";

export default function LoginPage() {
  useEffect(() => {
    console.log("✅ REST KEY:", import.meta.env.VITE_KAKAO_REST_KEY);
    console.log("✅ REDIRECT URI:", import.meta.env.VITE_KAKAO_REDIRECT_URI);
  }, []);


  return (
    <BackgroundContainer>
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        {/* 로고 */}
        <div className="mb-8">
          <LoginLogo />
        </div>

        {/* 로그인 폼 */}
        <LoginForm />
      </div>
    </BackgroundContainer>
  );
}

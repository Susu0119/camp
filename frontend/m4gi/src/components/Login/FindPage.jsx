"use client";
import React from "react";
import BackgroundContainer from "./UI/BackgroundContainer";
import LoginLogo from "./UI/LoginLogo";
import FindAccountForm from "./UI/FindAccountForm";

export default function AccountFindPage() {
  return (
    <BackgroundContainer>
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        {/* 로고 */}
        <div className="mb-8">
          <LoginLogo />
        </div>

        {/* 로그인 폼 */}
        <FindAccountForm />
      </div>
    </BackgroundContainer>
  );
};
<<<<<<<< HEAD:frontend/m4gi/src/pages/Login/Login_AccountFindPage.jsx
========

export default FindPage;
>>>>>>>> 1d6e07a16280e5cc24bbeb7e0972c9e57c3f219c:frontend/m4gi/src/components/Login/FindPage.jsx

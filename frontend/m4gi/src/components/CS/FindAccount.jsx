"use client";
import React from "react";
import BackgroundContainer from "../UI/BackgroundContainer";
import LoginLogo from "../UI/LoginLogo";
import VerificationForm from "../UI/VerificationForm";

const FindAccount = () => {
  return (
    <BackgroundContainer>
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        {/* 로고 */}
        <div className="mb-8">
          <LoginLogo />
        </div>

        {/* 로그인 폼 */}
        <VerificationForm />
      </div>
    </BackgroundContainer>
  );
};

export default FindAccount;

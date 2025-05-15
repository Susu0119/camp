"use client";
import React from "react";
import { Button } from "./Button";
import { KakaoButton } from "./KakaoButton";
import AdditionalOptions from "./AdditionalOptions";


export function CS_LoginForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative z-10 w-[90%] max-w-sm p-8 rounded-2xl shadow-lg border border-white 
           bg-[rgba(255,255,255,0.3)] backdrop-blur-md"

    >
      <h2 className="text-2xl text-center text-white font-semibold mb-6">
        로그인/회원가입
      </h2>

      <div className="mt-2">
        <KakaoButton variant="long" />
      </div>
      <div className=" space-y-2">
        <Button className="w-full bg-green-500 text-black mt-2">
          네이버로 로그인
        </Button>

        <Button className="w-full bg-white text-black border border-gray-300 mt-2">
          구글로 로그인
        </Button>

        <Button className="w-full bg-black text-white mt-2">
          애플로 로그인
        </Button>
      </div>
      <AdditionalOptions />
    </form>
  );
}
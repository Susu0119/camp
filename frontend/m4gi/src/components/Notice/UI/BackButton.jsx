"use client";
import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ 추가

export const BackButton = () => {
  const navigate = useNavigate(); // ✅ 훅 사용

  const handleClick = () => {
    navigate("/notice"); // ✅ 경로 수정
  };

  return (
    <div className="flex justify-center mt-6 w-full text-base font-bold leading-none text-center text-white whitespace-nowrap max-md:max-w-full">
      <button
        onClick={handleClick}
        className="self-stretch py-2.5 pr-4 pl-4 bg-fuchsia-700 rounded-md border border-solid border-zinc-200 min-h-10 hover:bg-fuchsia-800 transition-colors"
      >
        목록으로
      </button>
    </div>
  );
};

export default BackButton;

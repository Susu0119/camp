"use client";
import React from "react";
import CSSidebar from "../../components/MyPage/UI/MP_SideBar";
import MPHeader from "../../components/MyPage/UI/MP_Header";
import CancellationForm from "../../components/MyPage/UI/MP_CancellationForm";
import GuidelinesSection from "../../components/MyPage/UI/MP_GuildelineSection";
import RefundPolicySection from "../../components/MyPage/UI/MP_RefundPolicySection";
import ReservationDetails from "../../components/MyPage/UI/MP_ReservationDetails";

export default function MyPageCancel() {
  return (
    <div className="h-screen flex flex-col">
      {/* 상단 헤더 */}
      <MPHeader />

      {/* 본문 전체 영역 */}
      <div className="flex flex-1 overflow-auto">
            {/* 좌측 사이드바 */}
            <CSSidebar />

            {/* 우측 본문 콘텐츠 영역 */}
           <div className="flex-1 p-6 space-y-6 flex flex-col items-center">
  <div className="w-[612px] max-md:w-full mx-auto">
    <ReservationDetails />
  </div>

  <div className="w-[612px] max-md:w-full mx-auto">
    <CancellationForm />
  </div>

  <div className="w-[612px] max-md:w-full mx-auto">
    <GuidelinesSection />
  </div>

  <div className="w-[612px] max-md:w-full mx-auto">
    <RefundPolicySection />
  </div>

  <div className="flex justify-center w-[612px] max-md:w-full mx-auto">
    <button
      style={{ backgroundColor: "#8C06AD" }}
      className="w-full text-white px-6 py-2 rounded transition"
    >
      취소 신청
    </button>
  </div>
</div>
      </div>
    </div>
  );
}

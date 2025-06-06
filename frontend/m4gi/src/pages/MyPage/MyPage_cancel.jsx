import { useState } from "react";
import axios from "axios";
import CSSidebar from "../../components/MyPage/UI/MP_SideBar";
import Header from "../../components/Common/Header";
import CancellationForm from "../../components/MyPage/UI/MP_CancellationForm";
import GuidelinesSection from "../../components/MyPage/UI/MP_GuildelineSection";
import RefundPolicySection from "../../components/MyPage/UI/MP_RefundPolicySection";
import ReservationDetails from "../../components/MyPage/UI/MP_ReservationDetails";
import { useParams } from "react-router-dom";

export default function MyPageCancel() {
  const { reservationId } = useParams();

  if (!reservationId) {
    return <div>잘못된 요청입니다. 예약 ID가 없습니다.</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* 상단 헤더 */}
      <Header />

      {/* 본문 전체 영역 */}
      <div className="flex flex-1 overflow-auto">
        {/* 좌측 사이드바 */}
        <CSSidebar />

        {/* 우측 본문 콘텐츠 영역 */}
        <div className="flex-1 p-6 space-y-6 flex flex-col items-center">
          {/* 예약 상세 정보 */}
          <div className="w-[612px] max-md:w-full mx-auto">
            <ReservationDetails />
          </div>

          {/* 예약 취소 폼 */}
          <div className="w-[612px] max-md:w-full mx-auto">
            <CancellationForm reservationId={reservationId} />
          </div>

          {/* 유의사항 */}
          <div className="w-[612px] max-md:w-full mx-auto">
            <GuidelinesSection />
          </div>

          {/* 환불 규정 */}
          <div className="w-[612px] max-md:w-full mx-auto">
            <RefundPolicySection />
          </div>
        </div>
      </div>
    </div>
  );
}

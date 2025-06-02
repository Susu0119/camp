import React, { useState } from "react";
import MPHeader from "../../components/MyPage/UI/MP_Header";
import CSSidebar from "../../components/MyPage/UI/MP_SideBar";
import CancellationForm from "../../components/MyPage/UI/MP_CancellationForm";
import CancellationReasonDropdown from "../../components/MyPage/UI/MP_CancellationDropdown";
import GuidelinesSection from "../../components/MyPage/UI/MP_GuildelineSection";
import RefundPolicySection from "../../components/MyPage/UI/MP_RefundPolicySection";
import ReservationDetails from "../../components/MyPage/UI/MP_ReservationDetails";

const ReservationCancellationPage = () => {
  // 드롭다운 열림 상태 관리
  const [showReasons, setShowReasons] = useState(false);
  // 선택된 취소 사유 상태 관리
  const [selectedReason, setSelectedReason] = useState("");

  // 드롭다운 토글 함수
  const toggleReasons = () => {
    setShowReasons((prev) => !prev);
  };

  // 사유 선택 시 호출되는 함수
  const selectReason = (reason) => {
    setSelectedReason(reason);
    setShowReasons(false); // 선택 후 드롭다운 닫기
  };

  // 취소 요청 버튼 클릭 시
  const handleCancellationRequest = () => {
    console.log("Cancellation requested with reason:", selectedReason);
    // 실제 취소 요청 로직 구현 예정
  };

  return (
    <main className="w-full min-h-screen bg-white">
      {/* 상단 헤더 */}
      <MPHeader />

      <section className="flex min-h-[calc(100vh_-_100px)] max-md:flex-col">
        {/* 왼쪽 사이드바 */}
        <CSSidebar />

        {/* 본문 콘텐츠 */}
        <div className="flex flex-col gap-6 p-8 flex-1 bg-white mx-auto mt-6 w-full max-w-[612px]">
          {/* 0. 예약 상세 정보 */}
          <ReservationDetails />

          {/* 1. 취소 사유 입력 필드 */}
          <CancellationForm />        

          {/* 2. 안내사항 */}
          <GuidelinesSection />

          {/* 3. 환불 규정 */}
          <RefundPolicySection />

          {/* 4. 취소 요청 버튼 */}
          <div className="mt-6 text-center">
            <button
              onClick={handleCancellationRequest}
              className="px-10 py-3 bg-[#8C06AD] text-white text-sm font-semibold rounded hover:bg-[#720591] transition"
            >
              취소 요청
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ReservationCancellationPage;

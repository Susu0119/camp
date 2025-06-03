import React from "react";
import MPSidebar from "../../components/MyPage/UI/MP_SideBar";
import MPHeader from "../../components/MyPage/UI/MP_Header";
import ReservationFilter from "../../components/MyPage/UI/MP_ReservationFilter";
import ReservationCard from "../../components/MyPage/UI/MP_ReservationCard";

export default function MyPageReservations() {
  return (
    <div className="h-screen flex flex-col">
      <MPHeader />
      <div className="flex flex-1">
        <MPSidebar />

        {/* 본문 내용 - 가운데 정렬 */}
        <div className="flex-1 flex flex-col items-center justify-start p-10 gap-6">
          {/* 필터 UI */}
          <ReservationFilter />

          {/* 필터링 결과 - 예시 */}
          <div className="w-full max-w-4xl">
            {/* 필터링된 예약 리스트 자리 */}
            <div className="p-4 border rounded shadow-sm bg-white">
                <ReservationCard/>
                <ReservationCard/>
                <ReservationCard/>

           </div>
          </div>
        </div>
      </div>
    </div>
  );
}

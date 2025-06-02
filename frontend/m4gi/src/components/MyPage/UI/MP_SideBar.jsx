import React from 'react';
import SidebarItem from './MP_SideBarItem';

export default function CSSidebar() {
  return (
    <aside className="flex flex-col select-none w-64 h-[calc(100vh-65px)] border-r border-[#e5e7eb] p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden">
      {/* 홈 */}
      <SidebarItem text="홈" svgName="HomeIcon" route="/" />

      {/* 개인정보 • 계정 */}
      <SidebarItem text="개인정보 • 계정" isCategory />
      <div className="pl-4">
        <SidebarItem text="정보 수정" svgName="UpdateInfo" route="/" />
        <SidebarItem text="회원 탈퇴" svgName="DeleteAccount" route="/" />
      </div>

      {/* 예약 */}
      <SidebarItem text="예약" isCategory />
      <div className="pl-4">
        <SidebarItem text="나의 예약" svgName="MyReservation" route="/mypage/reservations" />
      </div>

      {/* 알림 설정 및 관리 */}
      <SidebarItem text="알림 설정 및 관리" isCategory />
      <div className="pl-4">
        <SidebarItem text="알림 설정" svgName="SetAlert" route="/" />
      </div>

      {/* 리뷰 작성 및 조회 */}
      <SidebarItem text="리뷰 작성 및 조회" isCategory />
      <div className="pl-4">
        <SidebarItem text="리뷰 작성" svgName="WriteReview" route="/" />
        <SidebarItem text="리뷰 조회" svgName="ViewReview" route="/" />
      </div>

      {/* 점주 기능 */}
      <SidebarItem text="점주 기능" isCategory />
      <div className="pl-4">
        <SidebarItem text="예약자 목록" svgName="ReserveList" route="/reservationDashboard" />
        <SidebarItem text="캠핑장 등록" svgName="AddCamp" route="/" />
        <SidebarItem text="운영 관리" svgName="ManageCamp" route="/" />
      </div>

      {/* 관리자 버전 */} 
      <SidebarItem text="관리자 버전" route="/admin/reservations" isOperator/> {/* route 수정 필요 */}

      {/* 사용자 버전 */}
      <SidebarItem text="사용자 버전" route="/" isOperator />
    </aside>
  );
}

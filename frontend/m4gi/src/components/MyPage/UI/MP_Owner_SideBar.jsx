import React from 'react';
import SidebarItem from './MP_SideBarItem';

export default function OwnerSidebar() {
  return (
    <aside className="flex flex-col select-none w-64 h-[calc(100vh-65px)] border-r border-[#e5e7eb] p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden">
      {/* 홈 */}
      <SidebarItem text="홈" svgName="HomeIcon" route="/" />

      {/* 점주 기능 */}
      <SidebarItem  isCategory />
      <div className="pl-4">
        <SidebarItem text="예약자 목록" svgName="ReserveList" route="/reservationDashboardPage" />
        <SidebarItem text="캠핑장 등록" svgName="AddCamp" route="/registCampgroundPage" />
        <SidebarItem text="운영 관리" svgName="ManageCamp" route="/registCampgroundPage" />
      </div>

      {/* 관리자 버전 */} 
      {/* <SidebarItem text="관리자 버전" route="/admin/reservations" isOperator/> route 수정 필요 */}

      {/* 사용자 버전 */}
      <SidebarItem text="사용자 버전" route="/mypage/main" isOperator />
    </aside>
  );
}

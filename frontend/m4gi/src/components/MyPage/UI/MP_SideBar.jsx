import React, { useEffect } from 'react';
import SidebarItem from './MP_SideBarItem';
import { useAuth } from '../../../utils/Auth';

export default function MPSidebar() {
  const { user: userInfo, isAuthenticated } = useAuth();

  return (
    <aside className="flex flex-col select-none w-64 h-auto min-h-screen border-r border-[#e5e7eb] p-4 [&::-webkit-scrollbar]:hidden">
      {/* 홈 */}
      <SidebarItem text="홈" svgName="HomeIcon" route="/main" />

      {/* 개인정보 • 계정 */}
      <SidebarItem text="개인정보 • 계정" isCategory />
      <div className="pl-4">
        <SidebarItem text="정보 수정" svgName="UpdateInfo" route="/mypage/profile" />
        <SidebarItem text="회원 탈퇴" svgName="DeleteAccount" route="/delete" />
      </div>

      {/* 예약 */}
      <SidebarItem text="예약" isCategory />
      <div className="pl-4">
        <SidebarItem text="나의 예약" svgName="MyReservation" route="/mypage/reservations" />
      </div>


      {/* 리뷰 작성 및 조회 */}
      <SidebarItem text="리뷰 작성 및 조회" isCategory />
      <div className="pl-4">
        <SidebarItem text="리뷰 작성" svgName="WriteReview" route="/mypage/review/write/" />
        {/*<SidebarItem text="리뷰 조회" svgName="ViewReview" route="/mypage/review/find/" />*/}
      </div>

      {/* 관리자 버전 */}
      {isAuthenticated && (userInfo.userRole === 3) && (
        <SidebarItem text="관리자 버전" route="/admin/dashboard" isOperator />
      )}

      {/* 점주 버전 */}
      {isAuthenticated && (userInfo.userRole === 2) && (
        <SidebarItem text="점주 버전" route="/staff/reservation" isOperator />
      )}

    </aside>
  );
}

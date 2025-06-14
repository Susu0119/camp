import React from 'react';
import SidebarItem from './MP_SideBarItem';
import { useAuth } from '../../../utils/Auth';

export default function OwnerSidebar() {
  const { user: userInfo, isAuthenticated, isLoading } = useAuth();
  return (
    <aside className="flex flex-col select-none w-64 h-[calc(100vh-65px)] border-r border-[#e5e7eb] p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden">
      {/* 홈 */}
      <SidebarItem text="홈" svgName="HomeIcon" route="/" />

      {/* 점주 기능 */}
      {isAuthenticated && (userInfo.userRole === 1 || userInfo.userRole === 2) && (
        <>
            <SidebarItem isCategory />
            <div className="pl-4">
                <SidebarItem text="캠핑장 관리" svgName="AddCamp" route="/staff/register" />
                <SidebarItem text="예약 관리" svgName="ReserveList" route="/staff/reservation" />
                <SidebarItem text="운영 관리" svgName="ManageCamp" route="/staff/register" />
            </div>
        </>
      )}

      {isAuthenticated && userInfo.userRole === 3 && (
        <SidebarItem text="관리자 버전" route="/admin/reservations" isOperator />
      )}

      {/* 사용자 버전 */}
      <SidebarItem text="사용자 버전" route="/mypage/main" isOperator />
    </aside>
  );
}
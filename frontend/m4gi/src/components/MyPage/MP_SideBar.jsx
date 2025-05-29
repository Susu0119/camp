import React from 'react';
import SidebarItem from './MP_SideBarItem';

export default function CSSidebar() {

  const handleSidebarClick = (menu) => {
    console.log(`사이드바 메뉴 ${menu}가(이) 클릭되었습니다.`);
    // 추가 동작 구현
  };

  return (
    <aside className="flex flex-col select-none w-64 h-[calc(100vh-65px)] border-r border-[#e5e7eb] p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden">
      {/* 홈 */}
      <SidebarItem text="홈" svgName="HomeIcon" onClick={() => handleSidebarClick('홈')} />

      {/* 개인정보, 계정 */}
      <SidebarItem text="개인정보, 계정" isCategory />
      <div className="pl-4">
        <SidebarItem text="정보 수정" svgName="UpdateInfo" onClick={() => handleSidebarClick('정보 수정하기')} />
        <SidebarItem text="회원 탈퇴" svgName="DeleteAccount" onClick={() => handleSidebarClick('회원 탈퇴')} />
      </div>

      {/* 예약 */}
      <SidebarItem text="예약" isCategory />
      <div className="pl-4">
        <SidebarItem text="나의 예약" svgName="MyReservation" onClick={() => handleSidebarClick('나의 예약')} />
      </div>

      {/* 알림 설정 및 관리 */}
      <SidebarItem text="알림 설정 및 관리" isCategory />
      <div className="pl-4">
        <SidebarItem text="알림 설정" svgName="SetAlert" onClick={() => handleSidebarClick('알림 설정')} />
      </div>

      {/* 리뷰 작성 및 조회 */}
      <SidebarItem text="리뷰 작성 및 조회" isCategory />
      <div className="pl-4">
        <SidebarItem text="리뷰 작성" svgName="WriteReview" onClick={() => handleSidebarClick('리뷰 작성')} />
        <SidebarItem text="리뷰 조회" svgName="ViewReview" onClick={() => handleSidebarClick('리뷰 조회')} />
      </div>

      {/* 점주 기능 */}
      <SidebarItem text="점주 기능" isCategory />
      <div className="pl-4">
        <SidebarItem text="예약자 목록" svgName="ReserveList" onClick={() => handleSidebarClick('예약자 목록')} />
        <SidebarItem text="캠핑장 등록" svgName="AddCamp" onClick={() => handleSidebarClick('캠핑장 등록')} />
        <SidebarItem text="운영 관리" svgName="ManageCamp" onClick={() => handleSidebarClick('운영 관리')} />
      </div>

      {/* 관리자 버전 */}
      <SidebarItem
        text="관리자 버전"
        image={<img src="https://storage.googleapis.com/m4gi/images/CS_SIDE_9.svg" alt="관리자 버전 아이콘" />}
        onClick={() => handleSidebarClick('관리자 버전')}
      />

      {/* 사용자 버전 */}
      <SidebarItem
        text="사용자 버전"
        image={<img src="https://storage.googleapis.com/m4gi/images/CS_SIDE_10.svg" alt="사용자 버전 아이콘" />}
        onClick={() => handleSidebarClick('사용자 버전')}
      />
    </aside>
  );
}

import React from 'react';
import SidebarItem from '../../CS/UI/CS_SidebarItem'

export default function CSSidebar() {
  const handleSidebarClick = (menu) => {
    console.log(`사이드바 메뉴 ${menu}가(이) 클릭되었습니다.`);
    // 추가 동작 구현
  };

  return (
    <aside className="flex flex-col select-none w-64 h-[calc(100vh-65px)] border-r border-[#e5e7eb] p-4 overflow-y-auto">
      {/* 홈 */}
      <SidebarItem
        text="홈"
        image={<img src="https://storage.googleapis.com/m4gi/images/CS_SIDE_1.svg" alt="홈 아이콘" />}
        onClick={() => handleSidebarClick('홈')}
      />

      {/* 개인정보, 계정 */}
      <SidebarItem text="개인정보, 계정" isCategory />
      <div className="pl-4">
        <SidebarItem text="정보 수정하기" onClick={() => handleSidebarClick('정보 수정하기')} />
        <SidebarItem text="회원 탈퇴" onClick={() => handleSidebarClick('회원 탈퇴')} />
      </div>

      {/* 예약 */}
      <SidebarItem text="예약" isCategory />
      <div className="pl-4">
        <SidebarItem text="나의 예약" onClick={() => handleSidebarClick('나의 예약')} />
      </div>

      {/* 알림 설정 및 관리 */}
      <SidebarItem text="알림 설정 및 관리" isCategory />
      <div className="pl-4">
        <SidebarItem text="알림 설정" onClick={() => handleSidebarClick('알림 설정')} />
      </div>

      {/* 리뷰 작성 및 조회 */}
      <SidebarItem text="리뷰 작성 및 조회" isCategory />
      <div className="pl-4">
        <SidebarItem text="리뷰 작성" onClick={() => handleSidebarClick('리뷰 작성')} />
        <SidebarItem text="리뷰 조회" onClick={() => handleSidebarClick('리뷰 조회')} />
      </div>

      {/* 점주 기능 */}
      <SidebarItem text="점주 기능" isCategory />
      <div className="pl-4">
        <SidebarItem text="예약자 목록" onClick={() => handleSidebarClick('예약자 목록')} />
        <SidebarItem text="캠핑장 등록" onClick={() => handleSidebarClick('캠핑장 등록')} />
      </div>

      {/* 운영 관리 */}
      <SidebarItem
        text="운영 관리"
        //image={<img src="https://storage.googleapis.com/m4gi/images/CS_SIDE_8.svg" alt="운영 관리 아이콘" />}
        onClick={() => handleSidebarClick('운영 관리')}
      />

      {/* 관리자 버전 */}
      <SidebarItem
        text="관리자 버전"
        //image={<img src="https://storage.googleapis.com/m4gi/images/CS_SIDE_9.svg" alt="관리자 버전 아이콘" />}
        onClick={() => handleSidebarClick('관리자 버전')}
      />

      {/* 사용자 버전 */}
      <SidebarItem
        text="사용자 버전"
        //image={<img src="https://storage.googleapis.com/m4gi/images/CS_SIDE_10.svg" alt="사용자 버전 아이콘" />}
        onClick={() => handleSidebarClick('사용자 버전')}
      />
    </aside>
  );
}
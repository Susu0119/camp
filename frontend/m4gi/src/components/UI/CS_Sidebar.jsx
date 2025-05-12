import React from 'react';
import SidebarItem from './CS_SidebarItem';

export default function Sidebar() {
    const handleSidebarClick = (menu) => {
        console.log(`사이드바 메뉴 ${menu}가(이) 클릭되었습니다.`);
        // 추가 동작 구현
    };

    return (
        <aside className="flex flex-col select-none w-64 h-[calc(100vh-65px)] border-r border-[#e5e7eb] p-4">
            <div className="mb-2">
                <SidebarItem
                    text="홈"
                    onClick={() => handleSidebarClick('홈')}
                />
            </div>

            <SidebarItem text="분실물" isCategory={true} />

            <SidebarItem
                text="분실물 신고"
                onClick={() => handleSidebarClick('분실물 신고')}
            />

            <SidebarItem
                text="분실물 조회"
                onClick={() => handleSidebarClick('분실물 조회')}
            />

            <SidebarItem text="고객 지원" isCategory={true} />

            <SidebarItem
                text="예약·결제"
                onClick={() => handleSidebarClick('예약·결제')}
            />

            <SidebarItem
                text="불량 회원·업체"
                onClick={() => handleSidebarClick('불량 회원·업체')}
            />

            <SidebarItem
                text="제휴·입점·광고"
                onClick={() => handleSidebarClick('제휴·입점·광고')}
            />

            <SidebarItem
                text="서비스 오류"
                onClick={() => handleSidebarClick('서비스 오류')}
            />
        </aside>
    );
};
import React from 'react';
import SidebarItem from './CS_SidebarItem';
import { useNavigate } from 'react-router-dom';

export default function CSSidebar() {
    const navigate = useNavigate();

    const handleSidebarClick = (route) => {
    if (route) {
      navigate(route);
      console.log(`사이드바 메뉴 ${route}가(이) 클릭되었습니다.`);
    }
  };

    return (
        <aside className="flex flex-col select-none w-64 h-[calc(100vh-65px)] border-r border-[#e5e7eb] p-4">
            <div className="mb-2">
                <SidebarItem
                    text="홈"
                    image={<img src='https://storage.googleapis.com/m4gi/images/CS_SIDE_1.svg'></img>}
                    onClick={() => handleSidebarClick('/cs/main')}
                />
            </div>

            <SidebarItem text="공지사항" isCategory={true} />

            <SidebarItem
                text="공지사항"
                image={<img src='https://storage.googleapis.com/m4gi/images/CS_SIDE_2.svg'></img>}
                onClick={() => handleSidebarClick('/notice')}
            />

            {/* <SidebarItem
                text="분실물 조회"
                image={<img src='https://storage.googleapis.com/m4gi/images/CS_SIDE_3.svg'></img>}
                onClick={() => handleSidebarClick('분실물 조회')}
            /> */}

            <SidebarItem text="고객 지원" isCategory={true} />

            <SidebarItem
                text="예약·결제"
                image={<img src='https://storage.googleapis.com/m4gi/images/CS_SIDE_4.svg'></img>}
                onClick={() => handleSidebarClick('/cs/payment')}
            />

            {/* <SidebarItem
                text="불량 회원·업체"
                image={<img src='https://storage.googleapis.com/m4gi/images/CS_SIDE_5.svg'></img>}
                onClick={() => handleSidebarClick('불량 회원·업체')}
            />

            <SidebarItem
                text="제휴·입점·광고"
                image={<img src='https://storage.googleapis.com/m4gi/images/CS_SIDE_6.svg'></img>}
                onClick={() => handleSidebarClick('제휴·입점·광고')}
            />

            <SidebarItem
                text="서비스 오류"
                image={<img src='https://storage.googleapis.com/m4gi/images/CS_SIDE_7.svg'></img>}
                onClick={() => handleSidebarClick('서비스 오류')}
            /> */}
        </aside>
    );
};
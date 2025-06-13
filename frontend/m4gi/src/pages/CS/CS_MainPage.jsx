import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/CS/UI/CS_Sidebar';
import SupportButton from '../../components/CS/UI/CS_MenuButton';
import Header from '../../components/Common/Header';

export default function CSMainPage() {
    const navigate = useNavigate();
    
    const handleButtonClick = (route) => {
        navigate(route);
        console.log(`${route} 버튼이 클릭되었습니다.`);
    };

    return (
        <div className="flex flex-col w-full h-screen bg-white">
            <Header showSearchBar={false} />
            <div className="flex">
                <Sidebar />
                <main className="flex flex-col flex-1 items-center p-10">
                    <div className="flex flex-col items-center">
                        <div className="flex justify-center w-full mb-8">
                            <h1 className="text-4xl font-bold text-black">
                                공지사항 및 문의
                            </h1>
                        </div>
                        <div className="flex justify-center w-full mb-8">
                            <p className="text-lg font-normal text-[#71717a] text-center">
                                공지사항, 예약 결제 문의 서비스를 이용하실 수 있습니다.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-6 w-full max-w-[672px]">
                            <SupportButton
                                text="공지사항"
                                onClick={() => handleButtonClick('/notice')}
                            />
                            {/* <SupportButton
                                text=""
                                onClick={() => handleButtonClick('분실물 조회')}
                            /> */}
                            <SupportButton
                                text="예약·결제 문의"
                                onClick={() => handleButtonClick('/cs/payment')}
                            />
                            {/* <SupportButton
                                text="불량 회원·업체 신고"
                                onClick={() => handleButtonClick('불량 회원·업체 신고')}
                            /> */}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}; 
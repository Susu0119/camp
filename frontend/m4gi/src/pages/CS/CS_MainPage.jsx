import React from 'react';
import Sidebar from './UI/CS_Sidebar';
import SupportButton from './UI/CS_MenuButton';
import Header from '../UI/Header';

export default function CSMainPage() {
    const handleButtonClick = (action) => {
        console.log(`${action} 버튼이 클릭되었습니다.`);
        // 여기에 각 버튼에 대한 추가 동작을 구현할 수 있습니다.
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
                                고객 지원 센터
                            </h1>
                        </div>
                        <div className="flex justify-center w-full mb-8">
                            <p className="text-lg font-normal text-[#71717a] text-center">
                                분실물 신고 및 조회, 고객 지원 서비스를 이용하실 수 있습니다.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-6 w-full max-w-[672px]">
                            <SupportButton
                                text="분실물 신고하기"
                                onClick={() => handleButtonClick('분실물 신고')}
                            />
                            <SupportButton
                                text="분실물 조회하기"
                                onClick={() => handleButtonClick('분실물 조회')}
                            />
                            <SupportButton
                                text="예약·결제 문의"
                                onClick={() => handleButtonClick('예약·결제 문의')}
                            />
                            <SupportButton
                                text="불량 회원·업체 신고"
                                onClick={() => handleButtonClick('불량 회원·업체 신고')}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}; 
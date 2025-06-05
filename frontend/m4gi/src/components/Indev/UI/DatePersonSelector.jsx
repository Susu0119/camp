"use client";
import React from "react";

export default function DatePersonSelector({ startDate, endDate, people = 2, setPeople }) {
    
    // 날짜 형식 변환 함수 (YYYY-MM-DD -> MM.DD (요일))
    const formatDateRange = (start, end) => {
        
        if (!start || !end) {
            return "날짜를 선택해주세요";
        }
        
        const startDate = new Date(start);
        const endDate = new Date(end);
        
        const formatDate = (date) => {
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
            const weekday = weekdays[date.getDay()];
            return `${month}.${day} (${weekday})`;
        };
        
        const result = `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
        return result;
    };

    // 인원수 증가
    const increasePeople = () => {
        const newCount = people + 1;
        setPeople(newCount);
    };

    // 인원수 감소
    const decreasePeople = () => {
        if (people > 1) {
            const newCount = people - 1;
            setPeople(newCount);
        }
    };

    return (
        <div className="flex flex-wrap gap-5 items-center mt-8 w-full max-md:max-w-full">
            <div className="flex flex-wrap gap-10 justify-between items-center self-stretch px-5 my-auto rounded-xl border-2 border-solid border-[color:var(--unnamed,#E5E5E5)] min-h-10 min-w-60 w-[760px] max-md:max-w-full">
                <div className="flex gap-2.5 justify-center items-center self-stretch p-2 my-auto w-10 min-h-10">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/3cfb3813c36c4fb01869edc22a56715b08b7d4e3?placeholderIfAbsent=true"
                        className="object-contain self-stretch my-auto w-6 aspect-square"
                        alt="달력"
                    />
                </div>
                <time className="self-stretch my-auto text-base leading-none text-center text-neutral-900">
                    {formatDateRange(startDate, endDate)}
                </time>
                <button className="flex overflow-hidden flex-col justify-center items-center self-stretch px-1 py-5 my-auto w-10 min-h-10">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/7911c011df4cae934d9fce8e77a52966527fad89?placeholderIfAbsent=true"
                        className="object-contain w-2.5 aspect-[2]"
                        alt="드롭다운"
                    />
                </button>
            </div>
            <div className="flex flex-1 shrink gap-10 justify-between items-center self-stretch px-5 my-auto rounded-xl border-2 border-solid basis-0 border-[color:var(--unnamed,#E5E5E5)] min-w-60">
                <div className="flex gap-2.5 justify-center items-center self-stretch p-2 my-auto w-10 min-h-10">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/6a53713129e933f7c8d0f0a243eb630a9643f7ec?placeholderIfAbsent=true"
                        className="object-contain self-stretch my-auto w-6 aspect-square"
                        alt="인원"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={decreasePeople}
                        className="w-6 h-6 flex items-center justify-center text-lg font-bold text-gray-600 hover:text-gray-800"
                        disabled={people <= 1}
                    >
                        −
                    </button>
                    <span className="self-stretch my-auto text-base leading-none text-center text-neutral-900 min-w-16">
                        인원 {people}
                    </span>
                    <button 
                        onClick={increasePeople}
                        className="w-6 h-6 flex items-center justify-center text-lg font-bold text-gray-600 hover:text-gray-800"
                    >
                        +
                    </button>
                </div>
                <button className="flex overflow-hidden flex-col justify-center items-center self-stretch px-1 py-5 my-auto w-10 min-h-10">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/7911c011df4cae934d9fce8e77a52966527fad89?placeholderIfAbsent=true"
                        className="object-contain w-2.5 aspect-[2]"
                        alt="드롭다운"
                    />
                </button>
            </div>
        </div>
    );
}
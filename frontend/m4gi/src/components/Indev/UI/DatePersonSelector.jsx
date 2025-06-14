"use client";
import React, { useState, useRef, useEffect } from "react";

export default function DatePersonSelector({ startDate, endDate, people = 2, setPeople }) {
    const [isPeopleDropdownOpen, setIsPeopleDropdownOpen] = useState(false);
    const peopleDropdownRef = useRef(null);

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

    const handlePeopleSelect = (num) => {
        setPeople(num);
        setIsPeopleDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (peopleDropdownRef.current && !peopleDropdownRef.current.contains(event.target)) {
                setIsPeopleDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-wrap gap-5 items-center mt-8 w-full max-md:max-w-full">
            <div className="flex flex-wrap gap-10 justify-between items-center self-stretch px-5 rounded-xl border-2 border-solid border-[color:var(--unnamed,#E5E5E5)] min-h-10 min-w-60 w-[760px] max-md:max-w-full">
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
                <div className="w-10" />
            </div>
            <div ref={peopleDropdownRef} className="flex flex-1 shrink justify-between items-center self-stretch px-5 rounded-xl border-2 border-solid basis-0 border-[color:var(--unnamed,#E5E5E5)] min-w-60 relative">
                <div className="flex gap-2.5 justify-center items-center self-stretch p-2 my-auto w-10 min-h-10">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/6a53713129e933f7c8d0f0a243eb630a9643f7ec?placeholderIfAbsent=true"
                        className="object-contain self-stretch my-auto w-6 aspect-square"
                        alt="인원"
                    />
                </div>
                <div className="text-center cursor-pointer" onClick={() => setIsPeopleDropdownOpen(prev => !prev)}>
                    <span className="my-auto text-base leading-none text-center text-neutral-900">
                        인원 {people}
                    </span>
                </div>
                <button
                    onClick={() => setIsPeopleDropdownOpen(prev => !prev)}
                    className="flex select-none overflow-hidden flex-col justify-center items-center self-stretch my-auto w-10 min-h-10">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/7911c011df4cae934d9fce8e77a52966527fad89?placeholderIfAbsent=true"
                        className={`object-contain w-2.5 aspect-[2] transition-transform duration-200 ${isPeopleDropdownOpen ? 'rotate-180' : ''}`}
                        alt="드롭다운"
                    />
                </button>
                {isPeopleDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-md shadow-lg border z-10 overflow-hidden">
                        <ul className="max-h-60 overflow-auto">
                            {Array.from({ length: 8 }, (_, i) => i + 1).map((num) => (
                                <li
                                    key={num}
                                    className="px-4 py-2 text-center text-neutral-900 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handlePeopleSelect(num)}
                                >
                                    {num}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
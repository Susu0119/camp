"use client";
import React, { useState, useEffect } from "react"; // useEffect 추가

// CalendarDay 컴포넌트는 이전과 동일하게 유지됩니다.
function CalendarDay({ day, dayIndex, weekIndex, isSelected, isStart, isEnd, isInRange, onClick, selectedRange }) { // selectedRange prop 추가
    if (!day) {
        return <div className="flex items-center justify-center w-8 h-8"></div>;
    }

    const baseClasses = "flex items-center justify-center w-8 h-8 text-lg cursor-pointer relative z-10";

    const getDateClasses = () => {
        let classes = baseClasses;

        // 조건 1: 시작일만 단독으로 선택되었거나 (selectedRange.end is null),
        // 또는 시작일과 종료일이 동일한 경우 (하루 범위)
        if (isStart && (selectedRange.end === null || selectedRange.start === selectedRange.end)) {
            classes += " bg-fuchsia-700 text-white rounded-full";
        }
        // 조건 2: 범위의 시작일인 경우 (selectedRange.end가 존재하고 start와 다름)
        else if (isStart) {
            classes += " bg-fuchsia-700 text-white rounded-l-full";
        }
        // 조건 3: 범위의 종료일인 경우 (selectedRange.start가 존재하고 end와 다름, isStart && isEnd는 이미 위에서 처리됨)
        else if (isEnd) {
            classes += " bg-fuchsia-700 text-white rounded-r-full";
        }
        // 조건 4: 범위 내의 다른 날짜 (시작도 끝도 아님)
        else if (isInRange) {
            classes += " text-neutral-900";
        }
        // 조건 5: 그 외 (선택되지 않은 날짜)
        else {
            classes += " text-neutral-900 hover:bg-gray-100 rounded-full";
        }
        return classes;
    };

    // getRangeBackgroundClasses 함수는 기존 코드 그대로 유지합니다.
    const getRangeBackgroundClasses = () => {
        let klasses = "absolute top-0 bottom-0 bg-fuchsia-700 bg-opacity-20 z-0";
        if (isStart && isEnd) {
            klasses += " w-8 rounded-full left-1/2 -translate-x-1/2";
        } else if (isStart) {
            klasses += " left-1/2 right-0 rounded-l-full";
        } else if (isEnd) {
            klasses += " left-0 right-1/2 rounded-r-full";
        } else if (isInRange) {
            klasses += " left-0 right-0";
        } else {
            return "hidden";
        }
        return klasses;
    };

    return (
        <div className="relative flex items-center justify-center w-full h-8">
            {(isInRange || isStart || isEnd) && ( // 배경 조건은 기존과 동일하게 유지 (단독 시작일 선택 시 배경 없음)
                selectedRange.end !== null && // 범위가 실제로 형성되었을 때만 배경을 그림 (시작일만 선택된 경우는 제외)
                <div className={getRangeBackgroundClasses()}></div>
            )}
            <button
                className={getDateClasses()}
                onClick={() => onClick(day)}
                type="button"
            >
                {day}
            </button>
        </div>
    );
}

export default function Calendar({ onDateRangeChange }) {
    const [selectedRange, setSelectedRange] = useState({ start: new Date().getDate(), end: null });
    // 현재 날짜를 Date 객체로 관리 (초기값: 현재 날짜로 초기화)
    const [currentDate, setCurrentDate] = useState(new Date()); // 현재 날짜로 초기화
    const [calendarWeeks, setCalendarWeeks] = useState([]);

    // currentDate가 변경될 때마다 달력 데이터를 새로 생성
    useEffect(() => {
        setCalendarWeeks(generateCalendarWeeksForMonth(currentDate));
    }, [currentDate]);

    // 선택된 년월일 값 가져올 수 있도록 (날짜가 바뀔 때 마다)
    useEffect(() => {
        if (onDateRangeChange) {
            let startDateObj = null;
            let endDateObj = null;

            if(selectedRange.start !== null) {
                startDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedRange.start);
            }
            if(selectedRange.end !== null) {
                endDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedRange.end);
            }

            onDateRangeChange({ start: startDateObj, end:endDateObj });
        }
    }, [selectedRange, currentDate, onDateRangeChange]);

    const generateCalendarWeeksForMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth(); // 0-indexed

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0); // 해당 월의 마지막 날

        const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 (일요일) - 6 (토요일)
        const totalDaysInMonth = lastDayOfMonth.getDate();

        const weeks = [];
        let currentWeek = [];

        // 첫 번째 주의 이전 달 날짜들 (null로 채움)
        for (let i = 0; i < firstDayOfWeek; i++) {
            currentWeek.push(null);
        }

        // 현재 달의 날짜들
        for (let day = 1; day <= totalDaysInMonth; day++) {
            currentWeek.push(day);
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        }

        // 마지막 주의 남은 공간 (null로 채움)
        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push(null);
            }
            weeks.push(currentWeek);
        }
        return weeks;
    };

    const handleDayClick = (day) => {
        if (!day) return;

        if (!selectedRange.start) {
            // 첫 번째 클릭: 시작일 설정
            setSelectedRange({ start: day, end: null });
        } else if (!selectedRange.end) {
            // 두 번째 클릭: 종료일 설정 또는 시작일 변경
            if (day < selectedRange.start) {
                // 새로 클릭한 날짜가 기존 시작일보다 이전이면,
                // 새 날짜를 시작일로 하고 종료일은 null로 설정 (선택 해제)
                setSelectedRange({ start: day, end: null });
            } else {
                // 새로 클릭한 날짜가 기존 시작일과 같거나 이후이면,
                // 기존 시작일은 유지하고 새 날짜를 종료일로 설정
                setSelectedRange({ start: selectedRange.start, end: day });
            }
        } else {
            // 세 번째 클릭 (이미 시작일과 종료일이 모두 선택된 상태):
            // 새로 클릭한 날짜를 시작일로 하고 종료일은 null로 설정 (새로운 범위 선택 시작)
            setSelectedRange({ start: day, end: null });
        }
    };

    const isInSelectedRange = (day) => {
        if (!selectedRange.start || !selectedRange.end || !day) return false;
        return day >= selectedRange.start && day <= selectedRange.end;
    };

    const isStartDate = (day) => {
        if (!day) return false;
        return selectedRange.start === day;
    };

    const isEndDate = (day) => {
        if (!day) return false;
        // 시작일과 종료일이 같을 경우, isEnd도 true가 되어야 합니다.
        return selectedRange.end === day;
    };


    const goToPreviousMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1);
            // 월 변경 시 선택 범위 초기화 (선택 사항)
            // setSelectedRange({ start: null, end: null });
            return newDate;
        });
    };

    const goToNextMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1);
            // 월 변경 시 선택 범위 초기화 (선택 사항)
            // setSelectedRange({ start: null, end: null });
            return newDate;
        });
    };

    // 화면에 표시될 연도와 월 (1월은 0이므로 +1)
    const displayMonthYear = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`;

    return (
        <section className="flex flex-col justify-center p-5 w-full rounded-xl border-2 border-solid border-neutral-200 max-md:max-w-full">
            <h3 className="p-2.5 w-full text-base text-neutral-900 max-md:max-w-full">
                날짜를 선택 해주세요.
            </h3>
            <div className="px-12 pb-4 mt-2.5 w-full max-md:px-5 max-md:max-w-full">
                <div className="flex flex-wrap gap-10 justify-between items-center pb-2.5 w-full max-md:max-w-full">
                    <h4 className="gap-2.5 self-stretch p-2.5 my-auto text-lg text-fuchsia-700">
                        {displayMonthYear} {/* 동적으로 변경된 월/연도 표시 */}
                    </h4>
                    <div className="flex gap-1 items-center self-stretch my-auto">
                        <button type="button" onClick={goToPreviousMonth} title="이전 달">
                            <img
                                src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/7f5a293b388661aea353f575e37ec726f39f4124?placeholderIfAbsent=true"
                                className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
                                alt="이전 달"
                            />
                        </button>
                        <button type="button" onClick={goToNextMonth} title="다음 달">
                            <img
                                src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/53a935461d37d6fd3a8456c2099bd5ee16b5d808?placeholderIfAbsent=true"
                                className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
                                alt="다음 달"
                            />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-0 px-8 mt-2.5 w-full text-lg text-center text-neutral-900 max-md:px-5 max-md:max-w-full">
                    {["일", "월", "화", "수", "목", "금", "토"].map(dayName => (
                        <span key={dayName} className="flex items-center justify-center h-8">{dayName}</span>
                    ))}
                </div>

                <div className="py-2.5 mt-2.5 w-full text-lg text-center whitespace-nowrap min-h-[250px] text-neutral-900 max-md:max-w-full">
                    {calendarWeeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="grid grid-cols-7 gap-0 px-8 pt-4 mt-2.5 w-full">
                            {week.map((day, dayIndex) => (
                                <CalendarDay
                                    key={`${weekIndex}-${day || 'null'}-${dayIndex}`} // day가 null일 경우를 대비해 key 수정
                                    day={day}
                                    dayIndex={dayIndex}
                                    weekIndex={weekIndex}
                                    isSelected={isStartDate(day) || isEndDate(day)}
                                    isStart={isStartDate(day)}
                                    isEnd={isEndDate(day)}
                                    isInRange={isInSelectedRange(day)}
                                    onClick={handleDayClick}
                                    selectedRange={selectedRange}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
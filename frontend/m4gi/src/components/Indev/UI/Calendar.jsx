"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import BasicAlert from "../../../utils/BasicAlert";

// CalendarDay 컴포넌트는 이전과 동일하게 유지됩니다.
function CalendarDay({day, isStart, isEnd, isInRange, isDisabled, onClick, selectedRange,
}) {
  if (!day) return <div className="flex items-center justify-center w-8 h-8" />;

  /* 버튼 색상 */
  const getButtonClasses = () => {
    if (isDisabled) return "flex items-center justify-center w-8 h-8 text-lg text-gray-300 cursor-not-allowed";

    let c = "relative z-10 flex items-center justify-center w-8 h-8 text-lg";

    // 조건 1: 시작일만 단독으로 선택되었거나 (selectedRange.end is null),
    // 또는 시작일과 종료일이 동일한 경우 (하루 범위)
    if (isStart && (!selectedRange.end || selectedRange.start === selectedRange.end))
      c += " bg-fuchsia-700 text-white rounded-full";
    // 조건 2: 범위의 시작일인 경우 (selectedRange.end가 존재하고 start와 다름)
    else if (isStart) c += " bg-fuchsia-700 text-white rounded-l-full";
    // 조건 3: 범위의 종료일인 경우 (selectedRange.start가 존재하고 end와 다름, isStart && isEnd는 이미 위에서 처리됨)
    else if (isEnd) c += " bg-fuchsia-700 text-white rounded-r-full";
      // 조건 4: 범위 내의 다른 날짜 (시작도 끝도 아님)
    else if (isInRange) c += " text-neutral-900";
    // 조건 5: 그 외 (선택되지 않은 날짜)
    else c += " text-neutral-900 hover:bg-gray-100 rounded-full";
    return c;
  };

  // getRangeBackgroundClasses 함수는 기존 코드 그대로 유지합니다.
  const getRangeBgClasses = () => {
    if (isDisabled || selectedRange.end === null) return "hidden";
    let k = "absolute top-0 bottom-0 bg-fuchsia-700 bg-opacity-20 z-0";
    if (isStart && isEnd) k += " w-8 rounded-full left-1/2 -translate-x-1/2";
    else if (isStart) k += " left-1/2 right-0 rounded-l-full";
    else if (isEnd) k += " left-0 right-1/2 rounded-r-full";
    else if (isInRange) k += " left-0 right-0";
    else return "hidden";
    return k;
  };

  return (
    <div className="relative flex items-center justify-center w-full h-8">
      <div className={getRangeBgClasses()} />
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => !isDisabled && onClick(day)}
        className={getButtonClasses()}
      >
        {day}
      </button>
    </div>
  );
}

/* ──────────────────── 달력 컴포넌트 ──────────────────── */
export default function Calendar({ setStartDate, setEndDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarWeeks, setCalendarWeeks] = useState([]);
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null }); // Date 객체로 저장
  const [disabledDates, setDisabledDates] = useState([]);
  const [showAlert, setShowAlert] = useState(false);  // alert 표시 state 추가
  const [alertMessage, setAlertMessage] = useState("");

  /* ── 매진 + 과거 날짜 수집 ── */
  useEffect(() => {
    const campId = window.location.pathname.split("/").pop();
    axios
      .get(`/web/api/campgrounds/${campId}/info`)
      .then(({ data }) => {
        const unavailable = data.unavailableDates || [];
        const soldOut = unavailable.map(
          ([y, m, d]) => new Date(y, m - 1, d).toDateString()
        );
        setDisabledDates(soldOut);
      })
      .catch(console.error);
  }, [currentDate]);

  /* ── 달력 배열 생성 ── */
  useEffect(() => {
    setCalendarWeeks(generateCalendarWeeksForMonth(currentDate));
  }, [currentDate]);

  /* ── 부모로 선택 범위 전달 ── */
  useEffect(() => {
    const fmt = (d) =>
      d
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
            d.getDate()
          ).padStart(2, "0")}`
        : null;
    setStartDate(fmt(selectedRange.start));
    setEndDate(fmt(selectedRange.end));
  }, [selectedRange, setStartDate, setEndDate]);

  /* ── 헬퍼: 매진 포함 여부 ── */
  const containsDisabled = (start, end) => {
    const tmp = new Date(start);
    while (tmp <= end) {
      if (disabledDates.includes(tmp.toDateString())) return true;
      tmp.setDate(tmp.getDate() + 1);
    }
    return false;
  };

  /* ── 날짜 클릭 ── */
const handleDayClick = (day) => {
  if (!day) return;

  const clicked = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
  const today   = new Date(); today.setHours(0,0,0,0);

  /* 1) 과거·매진 날짜는 무시 */
  if (clicked < today || disabledDates.includes(clicked.toDateString())) return;

  /*  아직 아무 것도 안 찍은 상태 → 시작일로. */
  if (!selectedRange.start) {
    setSelectedRange({ start: clicked, end: null });
    return;
  }

  /*  시작일만 찍혀 있고 종료일이 아직 없음
        (두 번째 클릭 단계) */
  if (!selectedRange.end) {
    /* 클릭한 날짜가 시작일보다 앞서면 시작일만 바꿔-치기 */
    if (clicked < selectedRange.start) {
      setSelectedRange({ start: clicked, end: null });
      return;
    }
    // 날짜 차이 계산 (밀리초 -> 일)
    const diff = Math.ceil((clicked - selectedRange.start) / 8.64e7);

    /* ‘매진 날짜 포함’ 체크 */
    if (containsDisabled(selectedRange.start, clicked)) {
      setAlertMessage("선택한 기간에 매진된 날짜가 포함되어 있습니다.");
      setShowAlert(true);
      setSelectedRange({ start: clicked, end: null });
      return;
    }

    /* 7일 이내 → 정상적으로 종료일 확정 */
    if (diff < 7) {
      setSelectedRange({ start: selectedRange.start, end: clicked });
    } else {
      /* 7일 초과 → 새 범위로 리셋 */
      setAlertMessage("최대 7일까지 선택 가능합니다.");
      setShowAlert(true);
      setSelectedRange({ start: clicked, end: null });
    }
    return;
  }

  /* 이미 시작·종료가 둘 다 잡혀 있는 상태 
        → 무조건 ‘새 범위 시작’ 으로 리셋 */
  setSelectedRange({ start: clicked, end: null });
};


  /* ── 범위 판별 ── */
  const isInRange = (day) =>
    selectedRange.start &&
    selectedRange.end &&
    day &&
    betweenDates(day, currentDate, selectedRange.start, selectedRange.end);

  const isStartDate = (day) =>
    day &&
    selectedRange.start &&
    new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getTime() ===
      selectedRange.start.getTime();

  const isEndDate = (day) =>
    day &&
    selectedRange.end &&
    new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getTime() ===
      selectedRange.end.getTime();

  /* ── 달 이동 ── */
  const prevMonth = () =>
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  /* ── 렌더 ── */
  return (
    <section className="flex flex-col justify-center p-5 w-full rounded-xl border-2 border-neutral-200">
      <h3 className="text-base text-neutral-900">날짜를 선택 해주세요.</h3>

      {/* 헤더 */}
      <div className="flex justify-between items-center mt-2">
        <h4 className="text-lg text-fuchsia-700">
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </h4>
        <div className="flex gap-1">
          <button type="button" onClick={prevMonth}>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/7f5a293b388661aea353f575e37ec726f39f4124"
              alt="prev"
              className="w-[18px]"
            />
          </button>
          <button type="button" onClick={nextMonth}>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/53a935461d37d6fd3a8456c2099bd5ee16b5d808"
              alt="next"
              className="w-[18px]"
            />
          </button>
        </div>
      </div>

      {/* 요일 */}
      <div className="grid grid-cols-7 gap-0 mt-3 text-center">
        {["일", "월", "화", "수", "목", "금", "토"].map((v) => (
          <span key={v} className="h-8 flex items-center justify-center">
            {v}
          </span>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="min-h-[250px]">
        {calendarWeeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-0 px-8 pt-4">
            {week.map((day, di) => {
              const dateObj =
                day !== null
                  ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                  : null;
              const disabled =
                !day ||
                (dateObj && dateObj < new Date().setHours(0, 0, 0, 0)) ||
                disabledDates.includes(dateObj?.toDateString());

              return (
                <CalendarDay
                  key={`${wi}-${di}`}
                  day={day}
                  isStart={isStartDate(day)}
                  isEnd={isEndDate(day)}
                  isInRange={isInRange(day)}
                  isDisabled={disabled}
                  onClick={handleDayClick}
                  selectedRange={selectedRange}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* 알림 */}
      {showAlert && (
        <BasicAlert severity="info" onClose={() => setShowAlert(false)}>
          {alertMessage}
        </BasicAlert>
      )}
    </section>
  );
}

/* ─────────── 헬퍼 ─────────── */
function generateCalendarWeeksForMonth(date) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0);

  const weeks = [];
  let week = [];

  for (let i = 0; i < first.getDay(); i++) week.push(null);

  for (let d = 1; d <= last.getDate(); d++) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

function betweenDates(day, baseDate, start, end) {
  const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), day);
  return d >= start && d <= end;
}

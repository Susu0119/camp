// Calendar.jsx
"use client";
import React, { useState, useEffect } from "react";
import BasicAlert from "../../../utils/BasicAlert";
import axios from "axios";

// 각 날짜 셀 컴포넌트
function CalendarDay({ day, isStart, isEnd, isInRange, isDisabled, onClick }) {
  // 빈 공간
  if (day === null) return <div className="w-12 h-12"></div>;

  // 기본 스타일
  let classes = "flex items-center justify-center w-12 h-12 text-base cursor-pointer relative z-10 transition-colors";

  // 비활성(과거/매진)
  if (isDisabled) classes += " text-gray-300 cursor-not-allowed";
  // 단일 선택
  else if (isStart && !isEnd && !isInRange) classes += " bg-fuchsia-700 text-white rounded-full";
  // 범위 시작
  else if (isStart) classes += " bg-fuchsia-700 text-white rounded-l-full";
  // 범위 종료
  else if (isEnd) classes += " bg-fuchsia-700 text-white rounded-r-full";
  // 범위 내부
  else if (isInRange) classes += " bg-fuchsia-700 text-white";
  // 기본
  else classes += " text-neutral-900 hover:bg-gray-100 rounded-full";

  return (
    <button
      className={classes}
      onClick={() => !isDisabled && onClick(day)}
      type="button"
    >
      {day}
    </button>
  );
}

export default function Calendar({ setStartDate, setEndDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weeks, setWeeks] = useState([]);
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const [disabledDates, setDisabledDates] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  // 오늘 자정 기준
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 달력 생성
  useEffect(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const days = [];
    // 앞부분 빈칸
    for (let i = 0; i < first.getDay(); i++) days.push(null);
    // 날짜
    for (let d = 1; d <= last.getDate(); d++) days.push(d);
    // 뒷부분 빈칸
    while (days.length % 7) days.push(null);
    const w = [];
    for (let i = 0; i < days.length; i += 7) w.push(days.slice(i, i + 7));
    setWeeks(w);
  }, [currentDate]);

  // 매진일 fetch
  useEffect(() => {
    const campId = window.location.pathname.split("/").pop();
    axios.get(`/web/api/campgrounds/${campId}/unavailable`)
      .then(res => setDisabledDates(res.data.map(d => new Date(d).toDateString())))
      .catch(console.error);
  }, [currentDate]);

  // 선택 전달
  useEffect(() => {
    const fmt = d => d ? `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` : null;
    setStartDate(fmt(selectedRange.start));
    setEndDate(fmt(selectedRange.end));
  }, [selectedRange, setStartDate, setEndDate]);

  const isSame = (d1, d2) => d1 && d2 && d1.toDateString() === d2.toDateString();

  const handleClick = day => {
    const clicked = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: clicked, end: null });
    } else if (!selectedRange.end) {
      if (clicked < selectedRange.start) {
        setSelectedRange({ start: clicked, end: null });
      } else {
        const diff = (clicked - selectedRange.start) / (1000*60*60*24);
        if (diff < 7) setSelectedRange({ ...selectedRange, end: clicked });
        else setShowAlert(true);
      }
    }
  };

  const isIn = day => {
    if (!selectedRange.start || !selectedRange.end || !day) return false;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date >= selectedRange.start && date <= selectedRange.end;
  };

  const isStart = day => {
    if (!selectedRange.start || !day) return false;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.getTime() === selectedRange.start.getTime();
  };

  const isEnd = day => {
    if (!selectedRange.end || !day) return false;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.getTime() === selectedRange.end.getTime();
  };

  const prev = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth()-1, 1));
  const next = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth()+1, 1));

  const title = `${currentDate.getFullYear()}년 ${currentDate.getMonth()+1}월`;

  return (
    <section className="max-w-3xl mx-auto p-6 border rounded-xl bg-white">
      <h3 className="text-xl font-semibold text-fuchsia-700 mb-4">{title}</h3>
      <div className="flex justify-between items-center mb-4">
        <button onClick={prev} className="p-2 rounded hover:bg-gray-100">&lt;</button>
        <button onClick={next} className="p-2 rounded hover:bg-gray-100">&gt;</button>
      </div>
      <div className="grid grid-cols-7 justify-items-center text-neutral-900 mb-2">
        {['일','월','화','수','목','금','토'].map((d,i) => (
          <div key={i} className="w-12 h-12 flex items-center justify-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 justify-items-center gap-0">
        {weeks.map((week, wi) =>
          week.map((day, di) => {
            const dateObj = day ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day) : null;
            const ds = dateObj ? dateObj.toDateString() : '';
            const disabled = dateObj ? dateObj < today || disabledDates.includes(ds) : false;
            return (
              <CalendarDay
                key={`${wi}-${di}`}
                day={day}
                isStart={isStart(day)}
                isEnd={isEnd(day)}
                isInRange={isIn(day)}
                isDisabled={disabled}
                onClick={handleClick}
              />
            );
          })
        )}
      </div>
      {showAlert && (
        <BasicAlert severity="info" onClose={() => setShowAlert(false)}>
          최대 7일까지 선택 가능합니다.
        </BasicAlert>
      )}
    </section>
  );
}
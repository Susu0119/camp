import React from "react";

export default function TimeSelect({ label, value, onChange }) {
  // 시간 옵션 생성 (00:00 ~ 23:30, 30분 단위)
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    timeOptions.push(`${String(hour).padStart(2, "0")}:00`);
    timeOptions.push(`${String(hour).padStart(2, "0")}:30`);
  }

  return (
    <div className="flex flex-col gap-1 w-[170px]">
      {label && <label className="text-sm font-medium">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className="border border-zinc-300 rounded px-3 py-2"
      >
        <option value="">시간 선택</option>
        {timeOptions.map((time, idx) => (
          <option key={idx} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
  );
}

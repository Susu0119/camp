"use client";
import React from "react";

// DatePicker는 이미 JSX 호환 가능한 형태로 props를 받고 있습니다.
export const DatePicker = ({ onDateSelect }) => {
    return (
        <button
            type="button"
            className="flex flex-1 flex-auto gap-4 items-center px-4 py-2.5 bg-white rounded-md border border-solid border-zinc-200 min-h-10"
            onClick={() => {
                // In a real implementation, this would open a date picker
                const today = new Date().toISOString().split('T')[0];
                onDateSelect(today);
            }}
        >
            <img
                src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/3df91f46c9ff23cf3ac3f9006b0694317d7f5ae2?placeholderIfAbsent=true"
                className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
                alt="Calendar icon"
            />
            <span className="self-stretch my-auto text-zinc-500">날짜 선택</span>
        </button>
    );
};

// TimePicker에서 React.FC<TimePickerProps> 타입 어노테이션 제거
export const TimePicker = ({ onTimeSelect }) => {
    return (
        <div className="flex flex-1 flex-auto gap-10 justify-between items-center px-3.5 py-2.5 text-center bg-white rounded-md border border-solid border-zinc-200 min-h-10">
            <select
                className="overflow-hidden self-stretch my-auto bg-transparent outline-none appearance-none w-full text-zinc-500"
                onChange={(e) => onTimeSelect(e.target.value)}
                defaultValue=""
            >
                <option value="" disabled>시간 선택</option>
                {Array.from({ length: 24 }).map((_, i) => (
                    <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                        {i.toString().padStart(2, '0')}:00
                    </option>
                ))}
            </select>
            <img
                src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/0a243ee595058e723d07fcfecdc1f6f5fd3dfca8?placeholderIfAbsent=true"
                className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
                alt="Dropdown icon"
            />
        </div>
    );
};
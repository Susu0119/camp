"use client";
import React from "react";
import FormField from "./MP_FormField";

const DateRangeSelector = () => {
  return (
    <FormField label="이용 날짜" labelClassName="text-left w-full">
      <div className="w-full flex justify-center items-center gap-4">
        
        {/* 시작 날짜 */}
        <div className="flex-1 border border-gray-300 rounded-md p-2 text-center text-sm leading-5 text-zinc-500 cursor-pointer select-none">
          2025.05.05
        </div>
        
        {/* 물결 표시 */}
        <div className="text-2xl text-zinc-500 select-none px-2">~</div>
        
        {/* 끝 날짜 */}
        <div className="flex-1 flex items-center justify-center border border-gray-300 rounded-md p-2 cursor-pointer select-none gap-2 text-sm leading-5 text-zinc-500">
          <span>2025.05.07</span>
        </div>
      </div>
    </FormField>
  );
};

export default DateRangeSelector;

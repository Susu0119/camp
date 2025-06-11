"use client";
import React from "react";
import FormField from "./MP_FormField";
// import BasicAlert from "/utils/BasicAlert";

export default function DateRangeSelector ({reservationDate, endDate}) {
  // if (!reservationDate || !endDate) {
  //   return (
  //     <div>
  //       <BasicAlert 
  //         severity="info" //success, info, warning, error 타입 존재
  //         onClose={() => setShowAlert(false)} //닫을때 실행할 함수, 닫지 않을거라면 필요 없습니다.
  //       >
  //         선택된 예약의 날짜 정보를 가져올 수 없습니다.
  //       </BasicAlert>
  //     </div>
  //   );
  // }

  // 날짜 배열을 "YYYY-MM-DD" 형식의 문자열로 변환
  const formatDateArray = (dateArray) => {
    if(!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
      return null;
    }
    const [year, month, day] = dateArray;
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');

    return `${year}-${formattedMonth}-${formattedDay}`;
  }
  
  return (
    <FormField label="이용 날짜" labelClassName="text-left w-full">
      <div className="w-full flex justify-center items-center gap-4">
        
        {/* 시작 날짜 */}
        <div className="flex-1 border border-gray-300 rounded-md p-2 text-center text-sm leading-5 text-zinc-500 cursor-pointer select-none">
          {formatDateArray(reservationDate) || "0000-00-00"}
        </div>
        
        {/* 물결 표시 */}
        <div className="text-2xl text-zinc-500 select-none px-2">~</div>
        
        {/* 끝 날짜 */}
        <div className="flex-1 flex items-center justify-center border border-gray-300 rounded-md p-2 cursor-pointer select-none gap-2 text-sm leading-5 text-zinc-500">
          {formatDateArray(endDate) || "0000-00-00"}
        </div>
      </div>
    </FormField>
  );
};

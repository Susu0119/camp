"use client";
import React from "react";

const CancellationReasonDropdown = ({
  showReasons,
  toggleReasons,
  selectedReason,
  selectReason
}) => {
  const reasons = [
    "개인 사정 - 가족 행사, 갑작스러운 업무 등",
    "날씨 문제 - 우천, 강풍, 태풍 등으로 캠핑이 어려운 경우",
    "비용 문제 - 경제적 사정으로 예약 유지가 어려운 경우",
    "숙소 상태 불만 - 캠핑장 시설이나 서비스에 대한 불만으로 인한 경우",
    "예약 중복 - 다른 장소와 예약이 중복된 경우",
    "질병 또는 사고 - 사용자 본인 또는 동반자가 아프거나 사고를 당한 경우",
    "기타 사유 직접 입력"
  ];

  return (
<div className="relative w-[612px]">
  <button
    onClick={toggleReasons}
    className="flex justify-between items-center w-140 px-4 py-2 h-10 rounded-md border border-zinc-200 bg-white text-left"
  >
    <span className={`text-sm ${selectedReason ? "text-black" : "text-zinc-500"}`}>
      {selectedReason || "취소 사유를 선택하세요."}
    </span>
    <svg
      width="8"
      height="4"
      viewBox="0 0 8 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transform ${showReasons ? "rotate-180" : ""} transition-transform`}
    >
      <path d="M4 4L0 0H8L4 4Z" fill="black" fillOpacity="0.5" />
    </svg>
  </button>

  {showReasons && (
    <div className="absolute z-10 w-full mt-1 flex flex-col gap-5 justify-center items-start self-stretch px-4 pt-2.5 pb-2.5 bg-white rounded-md border border-solid border-zinc-200 max-sm:p-4">
      {reasons.map((reason, index) => (
        <button
          key={index}
          onClick={() => selectReason(reason)}
          className="text-sm leading-5 text-zinc-500 hover:text-black text-left w-full"
        >
          {reason}
        </button>
      ))}
    </div>
  )}
</div>
  );
};

export default CancellationReasonDropdown;

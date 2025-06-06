// CancellationReasonDropdown.jsx
"use client";
import React from "react";

const CancellationReasonDropdown = ({
  showReasons,
  toggleReasons,
  cancelReason,
  setCancelReason,
}) => {
  const reasons = [
    "개인 사정 - 가족 행사, 갑작스러운 업무 등",
    "날씨 문제 - 우천, 강풍, 태풍 등으로 캠핑이 어려운 경우",
    "비용 문제 - 경제적 사정으로 예약 유지가 어려운 경우",
    "숙소 상태 불만 - 캠핑장 시설이나 서비스에 대한 불만으로 인한 경우",
    "예약 중복 - 다른 장소와 예약이 중복된 경우",
    "질병 또는 사고 - 사용자 본인 또는 동반자가 아프거나 사고를 당한 경우",
    "기타 사유 직접 입력",
  ];

  // "질병 또는 사고", "기타 사유 직접 입력" 선택 시 직접 입력 textarea 보이게 처리
  const showCustomInput =
    cancelReason?.startsWith("질병 또는 사고") ||
    cancelReason === "기타 사유 직접 입력";

  return (
    <>
      {/* 드롭다운 버튼 */}
      <button
        onClick={toggleReasons}
        className="flex justify-between items-center w-full px-4 py-2 h-10 rounded-md border border-zinc-200 bg-white text-left"
      >
        <span
          className={`text-sm ${
            cancelReason ? "text-black" : "text-zinc-500"
          }`}
        >
          {cancelReason || "취소 사유를 선택하세요."}
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

      {/* 드롭다운 목록 */}
      {showReasons && (
        <div className="mt-1 w-full flex flex-col gap-5 px-4 pt-2.5 pb-2.5 bg-white rounded-md border border-zinc-200">
          {reasons.map((reason, index) => (
            <button
              key={index}
              onClick={() => {
                setCancelReason(reason);
                toggleReasons();
              }}
              className={`text-sm leading-5 text-left w-full hover:text-black ${
                reason === cancelReason
                  ? "text-black font-medium"
                  : "text-zinc-500"
              }`}
            >
              {reason}
            </button>
          ))}
        </div>
      )}

      {/* 직접 입력 textarea */}
      {showCustomInput && (
        <textarea
          className="mt-3 w-full px-3 py-2 border border-zinc-300 rounded-md text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-cpurple"
          rows={3}
          placeholder="자세한 취소 사유를 입력해주세요."
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
        />
      )}
    </>
  );
};

export default CancellationReasonDropdown;

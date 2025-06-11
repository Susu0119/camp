// MP_CancellationDropdown.jsx
import React from "react";

const CancellationReasonDropdown = ({
  showReasons,
  toggleReasons,
  cancelReason,
  setCancelReason,
  customReason,
  setCustomReason,
}) => {
  const reasons = [
    "개인 사정 - 가족 행사, 갑작스러운 업무 등",
    "날씨 문제 - 우천, 강풍, 태풍 등으로 캠핑이 어려운 경우",
    "비용 문제 - 경제적 사정으로 예약 유지가 어려운 경우",
    "숙소 상태 불만 - 캠핑장 시설이나 서비스에 대한 불만으로 인한 경우",
    "예약 중복 - 다른 장소와 예약이 중복된 경우",
    "질병 또는 사고",
    "기타 사유 직접 입력",
  ];

  // cancelReason이 상세 입력이면 그 값을, 아니면 기본 사유명으로 선택 상태 계산
  const isCustomInput =
    cancelReason === "질병 또는 사고" ||
    cancelReason === "기타 사유 직접 입력" ||
    // 상세 입력일 경우 cancelReason이 직접 입력된 상세 텍스트일 수 있으므로, 별도 판단 필요
    (cancelReason && !reasons.includes(cancelReason));

  // 드롭다운에 표시할 기본 사유명 (cancelReason이 상세 텍스트면 그 전 단계 사유를 모르니까 따로 관리 필요)
  // 여기선 간단히, 상세입력일 때 textarea만 보여주고 버튼에는 기본 사유명을 표시하게 했습니다.

  // 기본 사유명 추출 (예: 상세입력일 경우 '기타 사유 직접 입력' 표시)
  const selectedReason = reasons.find((r) =>
    r === cancelReason || (isCustomInput && (r === "질병 또는 사고" || r === "기타 사유 직접 입력"))
  ) || "";

  const onSelectReason = (reason) => {
    toggleReasons();

    if (reason === "질병 또는 사고" || reason === "기타 사유 직접 입력") {
      setCancelReason(reason);
      setCustomReason(""); // 상세 입력 초기화
    } else {
      setCancelReason(reason);
      setCustomReason("");
    }
  };

  const onChangeCustomReason = (e) => {
    const value = e.target.value;
    setCustomReason(value);

    if (value.trim() === "") {
      // 상세 입력이 비었으면 기본 사유명 유지
      setCancelReason(selectedReason);
    } else {
      setCancelReason(value);
    }
  };

  return (
    <>
      <button
        onClick={toggleReasons}
        className="flex justify-between items-center w-full px-4 py-2 h-10 rounded-md border border-zinc-200 bg-white text-left"
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
        <div className="mt-1 w-full flex flex-col gap-5 px-4 pt-2.5 pb-2.5 bg-white rounded-md border border-zinc-200">
          {reasons.map((reason, index) => (
            <button
              key={index}
              onClick={() => onSelectReason(reason)}
              className={`text-sm leading-5 text-left w-full hover:text-black ${
                reason === selectedReason ? "text-black font-medium" : "text-zinc-500"
              }`}
            >
              {reason}
            </button>
          ))}
        </div>
      )}

      {isCustomInput && (
        <textarea
          className="mt-3 w-full px-3 py-2 border border-zinc-300 rounded-md text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-cpurple"
          rows={3}
          placeholder="자세한 취소 사유를 입력해주세요."
          value={customReason}
          onChange={onChangeCustomReason}
        />
      )}
    </>
  );
};

export default CancellationReasonDropdown;

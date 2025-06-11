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

  // 상세 입력 필드가 나타날 조건 
  const shouldShowCustomInput =
    cancelReason === "질병 또는 사고" ||
    cancelReason === "기타 사유 직접 입력";

  // 드롭다운 버튼에 표시될 텍스트 결정 
  const displayReasonText = (() => {
    // cancelReason이 선택되지 않았다면 기본 메시지
    if (!cancelReason) {
      return "취소 사유를 선택하세요.";
    }
    // cancelReason이 reasons 배열에 포함된 값이라면 해당 값을 그대로 표시
    // '질병 또는 사고'나 '기타 사유 직접 입력'도 여기에 해당됩니다.
    const foundReason = reasons.find((r) => r === cancelReason);
    if (foundReason) {
      return foundReason;
    }
    // 예외적인 경우 (예: cancelReason이 직접 입력된 customReason 값일 때)
    // 이 경우는 발생하지 않아야 하지만, 안전장치로 빈 문자열 반환
    return "";
  })();


  const onSelectReason = (reason) => {
    toggleReasons(); // 드롭다운 닫기

    if (reason === "질병 또는 사고" || reason === "기타 사유 직접 입력") {
      setCancelReason(reason); // '질병 또는 사고' 또는 '기타 사유 직접 입력' 자체를 사유로 설정 (대분류 유지)

    } else {
      setCancelReason(reason); // 선택된 일반 사유를 설정
      setCustomReason(""); // 상세 입력 필드는 비워줌
    }
  };

  const onChangeCustomReason = (e) => {
    const value = e.target.value;
    setCustomReason(value);

  };

  return (
    <>
      <button
        onClick={toggleReasons}
        className="flex justify-between items-center w-full px-4 py-2 h-10 rounded-md border border-zinc-200 bg-white text-left"
      >
        <span className={`text-sm ${displayReasonText === "취소 사유를 선택하세요." ? "text-zinc-500" : "text-black"}`}>
          {displayReasonText}
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
                cancelReason === reason ? "text-black font-medium" : "text-zinc-500"
              }`}
            >
              {reason}
            </button>
          ))}
        </div>
      )}

      {/* '질병 또는 사고' 또는 '기타 사유 직접 입력' 선택 시에만 상세 입력 필드 표시 */}
      {shouldShowCustomInput && (
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
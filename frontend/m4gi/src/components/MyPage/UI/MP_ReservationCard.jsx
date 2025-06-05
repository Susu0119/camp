import React from 'react';

const ReservationCard = ({ imageUrl, title, location, dates, amount, status, onCancel }) => {
  return (
    <article className="flex items-center justify-start gap-6 px-6 py-4 mb-6 bg-white border border-[#8C06AD] rounded-md w-full max-sm:flex-col max-sm:items-start">
      <div className="flex items-center gap-4">
        <div className="pl-2">
          <img
            src={imageUrl || "/1.png"}
            alt="캠핑장 이미지"
            className="object-cover rounded-md w-[200px] h-[150px] max-sm:w-full max-sm:h-[120px]"
          />
        </div>

        <div className="flex flex-col justify-start gap-2 px-2">
          <h3 className="text-m font-semibold text-black">캠핑장 이름 : {title}</h3>
          <p className="text-s font-light text-black">위치 : {location}</p>
          <p className="text-s font-light text-black">이용 예정일 : {dates}</p>
          <p className="text-s font-light text-black">결제 금액 : {amount}</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 ml-auto min-w-[110px]">
        {/* 상태에 따라 버튼 조건부 렌더링 */}
        {status === "active" && (
          <>
            <button className="w-30 text-sm font-normal text-white bg-[#8C06AD] px-3 py-1.5 rounded border border-[#8C06AD]">
              입실하기
            </button>
            <button
              onClick={onCancel}
              className="w-30 text-center text-sm text-white bg-[#8C06AD] px-3 py-1.5 rounded border border-[#8C06AD]"
            >
              예약 취소
            </button>
            {/* 체크리스트 보기 버튼은 예약중일 때만 노출 */}
            <button className="w-30 text-sm text-white bg-[#8C06AD] px-3 py-1.5 rounded border border-[#8C06AD]">
              체크리스트 보기
            </button>
          </>
        )}

        {status === "completed" && (
          <p className="text-sm text-gray-600">이용 완료</p>
        )}

        {status === "cancelled" && (
          <p className="text-sm text-red-500">취소됨</p>
        )}
      </div>
    </article>
  
);
};

export default ReservationCard;

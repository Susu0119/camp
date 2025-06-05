import React from "react";
import Button from "../../Common/Button";

const BookingButton = ({ onClick, price }) => {
  return (
    <Button
      className="w-full relative overflow-hidden bg-cpurple text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
      onClick={onClick}
    >
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

      {/* 컨텐츠 */}
      <div className="relative flex items-center justify-center gap-3">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>

        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">예약하기</span>
          <span className="text-sm">
            {price?.toLocaleString()}원
          </span>
        </div>

        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* 클릭 시 리플 효과 */}
      <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 pointer-events-none transition-opacity duration-150 active:opacity-100"></div>
    </Button>
  );
};

export default BookingButton;

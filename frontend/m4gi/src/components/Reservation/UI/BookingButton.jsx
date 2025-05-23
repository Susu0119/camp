import React from 'react';


const BookingButton = () => {
  return (
    <button className="flex relative justify-center items-center self-stretch mt-3 h-10 bg-fuchsia-700 rounded-md w-full">
      <span className="text-base font-bold text-center text-white max-sm:text-sm">
        예약하기
      </span>
      <span className="ml-2 text-base font-bold text-center text-white max-sm:text-sm">
        | 119,000원 (1박)
      </span>
    </button>
  );
};

export default BookingButton;

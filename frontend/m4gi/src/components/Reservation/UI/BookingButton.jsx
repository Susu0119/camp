import React from "react";
import Button from "../../Common/Button";

const BookingButton = ({ onClick, price }) => {
  return (
    <Button 
    className="w-full h-12 px-6 text-base bg-[#8C06AD] text-white font-bold rounded-md whitespace-nowrap"
    onClick={onClick}>
      예약하기
      <span className="ml-2">| {price?.toLocaleString()}원</span>
    </Button>
  );
};

export default BookingButton;

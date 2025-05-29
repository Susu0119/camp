import React from "react";
import Button from "../../Common/Button";

const BookingButton = ({ onClick, price }) => {
  return (
    <Button 
    className="h-10 w-full bg-[#8C06AD] rounded-lg text-white font-bold text-sm"
    onClick={onClick}>
      예약하기
      <span className="ml-2">| {price?.toLocaleString()}원</span>
    </Button>
  );
};

export default BookingButton;

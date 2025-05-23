import React from "react";
import Button from "../../Common/Button";

const BookingButton = ({ onClick, price }) => {
  return (
    <Button onClick={onClick}>
      예약하기
      <span className="ml-2">| {price?.toLocaleString()}원</span>
    </Button>
  );
};

export default BookingButton;

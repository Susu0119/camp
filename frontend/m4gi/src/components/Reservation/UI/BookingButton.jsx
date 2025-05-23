import React from "react";
import Button from "../../Common/Button";

const BookingButton = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      예약하기
      <span className="ml-2">| 119,000원 (1박)</span>
    </Button>
  );
};

export default BookingButton;

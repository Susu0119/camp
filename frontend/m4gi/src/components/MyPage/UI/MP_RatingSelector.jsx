"use client";
import React, { useState } from "react";
import FormField from "./MP_FormField";

const MAX_RATING = 5;

const RatingSelector = () => {
  // 현재 선택된 별점 상태 (0~5)
  const [rating, setRating] = useState(0);

  // 별 클릭 핸들러
  // 만약 이미 클릭한 별을 클릭하면 해당 별점 해제(0으로 초기화)
  // 그렇지 않으면 클릭한 별점으로 설정
  const handleClick = (index) => {
    if (rating === index + 1) {
      setRating(0);
    } else {
      setRating(index + 1);
    }
  };

  return (
    <FormField label="평점 선택" labelClassName="text-left w-full">
  <div className="w-full border border-gray-300 rounded-md p-2 mt-1 flex justify-center">
    {[...Array(MAX_RATING)].map((_, index) => (
      <span
        key={index}
        onClick={() => handleClick(index)}
        className="text-fuchsia-700 text-2xl cursor-pointer select-none"
        aria-label={`${index + 1}점`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleClick(index);
          }
        }}
      >
        {index < rating ? "★" : "☆"}
      </span>
    ))}
  </div>
</FormField>


  );
};

export default RatingSelector;

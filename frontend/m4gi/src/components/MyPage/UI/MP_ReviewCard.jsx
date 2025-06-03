"use client";
import React from "react";

const ReviewCard = ({ review }) => {
  // review가 undefined일 경우 빈 객체로 대체하여 구조분해 오류 방지
  const {
    rating = 0,
    reviewText = "리뷰가 없습니다.",
    campName = "캠핑장 이름 없음",
    location = "장소 정보 없음",
    date = "날짜 정보 없음",
    imageUrl = "https://via.placeholder.com/281x160?text=No+Image",
  } = review || {};

  // 별점 렌더링
  const renderStars = () => {
    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
    return stars;
  };

  return (
    <article className="flex gap-6 items-center p-2.5 w-full bg-white rounded-xl max-md:flex-col max-md:gap-4 max-sm:p-4">
      <img
        src={imageUrl}
        alt={`${campName} 이미지`}
        className="h-40 rounded-xl w-[281px] max-md:w-full max-md:max-w-[300px] max-sm:w-full max-sm:h-[200px]"
      />
      <div className="flex flex-col flex-1 gap-2.5 items-start">
        <div className="text-lg font-bold text-fuchsia-700">
          {renderStars()}
        </div>
        <p className="text-base text-neutral-900">{reviewText}</p>
        <div className="flex gap-6 items-center">
          <span className="text-sm text-neutral-400">{location}</span>
          <time className="text-sm text-neutral-400">{date}</time>
        </div>
      </div>
    </article>
  );
};

export default ReviewCard;

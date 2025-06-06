"use client";
import React from "react";
import ReviewDateRangeSelector from "./MP_Review_DateRangeSelector";
import ReviewLocationSelector from "./MP_Review_LocationSelector";
import SearchButton from "./MP_Review_SearchButton";
import ReviewCard from "./MP_ReviewCard";

const ReviewContent = () => {
  const handleSearch = () => {
    // Handle search functionality
    console.log("Searching for reviews...");
  };

  return (
    <section
      className="flex flex-col items-center px-10 py-0 pt-16 ml-80 w-[calc(100%_-_315px)]
                 max-md:px-5 max-md:py-0 max-md:ml-72 max-md:w-[calc(100%_-_280px)]
                 max-sm:px-4 max-sm:py-0 max-sm:w-full"
    >
      {/* 제목 */}
      <h1 className="w-[672px] max-w-full mx-auto text-2xl font-bold leading-5 text-black h-[45px] px-2.5">
        리뷰 조회
      </h1>

      {/* 날짜, 위치 선택 영역 */}
      <div className="flex flex-col gap-6 items-center w-[672px] max-w-full mx-auto rounded-md">
        <div className="flex flex-col gap-2 items-center w-full px-2.5 pt-0 pb-2.5 rounded-md border border-solid border-zinc-200 max-sm:px-2.5">
          <ReviewDateRangeSelector className="w-full" />
          <ReviewLocationSelector className="w-full" />
        </div>
      </div>

      {/* 검색 버튼 */}
      <div className="flex flex-col gap-6 items-center w-[672px] max-w-full mx-auto pb-5 rounded-md">
        <SearchButton onClick={handleSearch} className="w-full max-w-xs" />
      </div>

      {/* 리뷰 카드 리스트 */}
      <div className="flex flex-col gap-8 items-center w-[672px] max-w-full mx-auto pt-0 pb-8 px-5 max-sm:px-0">
        <ReviewCard
          className="w-full"
          rating={4}
          reviewText="물소리와 새소리가 어우러진 자연 속에서 정말 평화로운 시간을 보냈어요. 사이트 간 간격도 넓어서 프라이버시가 잘 지켜졌고, 전기와 온수도 잘 나와서 불편함 없이 지낼 수 있었어요. 화장실과 샤워실도 깔끔하게 관리되고 있어서 만족스러웠고, 주변 산책로도 잘 정비돼 있어 산책하며 힐링하기에 딱 좋은 캠핑장이었어요."
          location="캠핑 A동"
          date="2025-05-12"
          imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/2fc48138c345678c627e8003ec42270efb6fae92?placeholderIfAbsent=true"
        />

        <ReviewCard
          className="w-full"
          rating={4}
          reviewText="맑은 공기와 조용한 분위기가 정말 좋아요. 밤에는 별이 가득하고, 아침엔 새소리에 눈을 떴어요. 도심에서 벗어나 진짜 힐링이 필요할 때 꼭 다시 오고 싶어요."
          location="캠핑 A동"
          date="2025-05-11"
          imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/065a8e16f8f7cfbdc5ba9bdb873461c369c51c11?placeholderIfAbsent=true"
        />
      </div>

      {/* 하단 빈 공간 */}
      <div className="w-[50px] max-w-full mx-auto h-[45px]" />
    </section>
  );
};

export default ReviewContent;

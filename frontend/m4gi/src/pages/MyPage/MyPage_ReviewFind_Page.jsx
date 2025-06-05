import React from "react";

import ReviewDateRangeSelector from "../../components/MyPage/UI/MP_Review_DateRangeSelector.jsx";
import ReviewLocationSelector from "../../components/MyPage/UI/MP_Review_LocationSelector.jsx";
import SearchButton from "../../components/MyPage/UI/MP_Review_SearchButton.jsx";
import ReviewCard from "../../components/Main/UI/ReviewCard.jsx";
import MPHeader from "../../components/MyPage/UI/MP_Header.jsx";
import MPSidebar from "../../components/MyPage/UI/MP_SideBar.jsx";

export default function ReviewFindPage() {
  const dummyReviews = [
    {
      rating: 4,
      reviewText: "정말 좋은 캠핑장이었어요!",
      campName: "평창 오토캠핑장",
      location: "강원도 평창",
      date: "2025-06-01",
      imageUrl: "https://example.com/camp1.jpg",
    },
    {
      rating: 5,
      reviewText: "아이들과 함께 즐거운 시간을 보냈습니다.",
      campName: "가평 힐링캠프",
      location: "경기도 가평",
      date: "2025-05-25",
      imageUrl: "https://example.com/camp2.jpg",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 상단 헤더 */}
      <MPHeader />

      {/* 사이드바 + 본문 레이아웃 */}
      <div className="flex flex-1">
        {/* 좌측 사이드바 */}
        <MPSidebar className="w-64 bg-white border-r shadow-sm" />

        {/* 본문 */}
      <main className="flex-1 bg-white flex flex-col items-center p-8 pt-40">

        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-semibold mb-6 text-center">리뷰 조회</h1>

          {/* 검색 필터 */}
          <section className="mb-8 space-y-4 flex flex-col items-center">
            <ReviewDateRangeSelector />
            <ReviewLocationSelector />
            <SearchButton />
          </section>

          {/* 리뷰 카드 리스트 */}
          <section className="space-y-4 flex flex-col items-center">
            {dummyReviews.map((review, idx) => (
              <ReviewCard key={idx} review={review} />
            ))}
          </section>
        </div>
      </main>

      </div>
    </div>
  );
}

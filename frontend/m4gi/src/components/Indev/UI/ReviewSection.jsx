"use client";
import React, { useState } from "react";
import ReviewCard from "../../Main/UI/ReviewCard";
import StarRating from "../../Common/StarRating";

const formatDateArray = (dateArray) => {
    if (!dateArray || dateArray.length < 3) return "";
    const year = dateArray[0];
    const month = String(dateArray[1]).padStart(2, '0');
    const day = String(dateArray[2]).padStart(2, '0');
    // 필요한 경우 시간 정보도 사용 가능:
    // const hours = String(dateArray[3]).padStart(2, '0');
    // const minutes = String(dateArray[4]).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// 리뷰 사진 URL을 파싱하여 첫 번째 사진 가져오기
const reviewFirstImage = (reviewURL) => {
    if (typeof reviewURL !== 'string' || !reviewURL.trim()) {
        return null; // 문자열이 아니거나 비어있으면 null 반환
    }
    try {
        const photoObject = JSON.parse(reviewURL);
        if (photoObject && photoObject.photo_urls && photoObject.photo_urls.length > 0) {
            return photoObject.photo_urls[0];
        }
    } catch (e) {
        console.error("리뷰 사진 JSON 파싱 오류:", e, reviewURL);
    }
    return null;
};

export default function ReviewSection({campgroundData}) {
    const [showAllReviews, setShowAllReviews] = useState(false);

    const { campground, reviews = [], totalReviewCount = 0 } = campgroundData || {};
    const campgroundName = campground?.campground_name || "캠핑장 이름"; // 캠핑장 이름 가져오기

    // 평균 별점 계산
    const rawAverageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + Number(review.review_rating), 0) / reviews.length
        : 0;

    const averageRating = Math.floor(rawAverageRating * 2) / 2;

    console.log(averageRating);

    // 표시할 리뷰 개수 (예: 처음에는 3개만 보여주고 싶다면)
    const displayLimit = 3;
    const displayedReviews = showAllReviews 
        ? reviews // 전체 보기일 때는 모든 리뷰
        : reviews.slice(0, displayLimit); // 간략히 보기일 때는 처음 3개만

    return (
        <section className="mt-8 w-full max-md:max-w-full">
            <h2 className="gap-2.5 p-2.5 w-full text-2xl font-bold text-neutral-900 max-md:max-w-full">
                방문 후기
            </h2>

            <div className="flex flex-col justify-center px-2.5 py-5 mt-8 w-full text-center max-md:max-w-full">
                <div className="w-full max-md:max-w-full">
                    <p className="text-2xl font-bold text-fuchsia-700 max-md:max-w-full">
                        <StarRating rating={averageRating} readOnly={true} />
                    </p>
                    <p className="mt-1.5 text-sm text-zinc-500 max-md:max-w-full">
                    {totalReviewCount}명 평가
                    </p>
                </div>
            </div>

            <div className="mt-8 text-sm text-right text-fuchsia-700 max-md:max-w-full">
                {/* ✨ 리뷰가 displayLimit보다 많을 때만 버튼을 표시 */}
                {reviews.length > displayLimit && (
                    <button
                        onClick={() => setShowAllReviews(!showAllReviews)} // ✨ onClick 이벤트 핸들러 추가
                        aria-expanded={showAllReviews} // 접근성 향상
                        aria-controls="reviews-list" // 접근성 향상
                    >
                        {showAllReviews ? "간략히 보기" : "전체 보기"} {/* ✨ 버튼 텍스트 변경 */}
                    </button>
                )}
            </div>

            <div className="mt-8 w-full max-md:max-w-full">
                {reviews.length > 0 ? (
                    displayedReviews.map((reviewItem) => { // ✨ displayedReviews 사용
                        const url = reviewFirstImage(reviewItem.review_photos);
                        const reviewDate = formatDateArray(reviewItem.created_at);

                        return (
                            <ReviewCard
                                key={reviewItem.review_id}
                                review={{
                                    CampName: campgroundName, // 동적으로 캠핑장 이름 전달
                                    // reviewItem에 site 정보가 없으므로 임시로 '전체 사이트' 등으로 표시하거나, 백엔드에서 추가 필요
                                    site: reviewItem.site_name || "사이트", // ReviewCard가 site prop을 받는다면 이 부분은 실제 데이터에 맞게 조정
                                    content: reviewItem.review_content,
                                    score: reviewItem.review_rating.toString(),
                                    author: reviewItem.provider_user_id || "익명", // 작성자 닉네임이 없으면 '익명' 처리
                                    date: reviewDate,
                                }}
                                variant='long'
                                image={url} // 기본 리뷰 이미지
                                site={reviewItem.site_name || "사이트"} // ReviewCard의 site prop에 동적 값 전달
                            />
                        );
                    })
                ) : (
                    <p className="text-center text-neutral-500 py-10">아직 작성된 리뷰가 없습니다.</p>
                )}
            </div>
        </section>
    );
}
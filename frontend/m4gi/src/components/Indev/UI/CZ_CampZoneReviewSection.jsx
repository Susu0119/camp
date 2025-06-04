// ZoneReviewSection.jsx
import React, { useState } from "react";
import ReviewCard from "../../Main/UI/ReviewCard";
import StarRating from "../../Common/StarRating";

const formatDateArray = (dateArray) => {
    if (!dateArray || dateArray.length < 3) return "";
    const year = dateArray[0];
    const month = String(dateArray[1]).padStart(2, '0');
    const day = String(dateArray[2]).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const reviewFirstImage = (reviewURL) => {
    if (typeof reviewURL !== 'string' || !reviewURL.trim()) {
        return null;
    }
    try {
        const photoObject = JSON.parse(reviewURL);
        if (photoObject?.photo_urls?.length > 0) {
            return photoObject.photo_urls[0];
        }
    } catch (e) {
        console.error("리뷰 사진 JSON 파싱 오류:", e, reviewURL);
    }
    return null;
};

export default function CZCampZoneReviewSection({ zoneData }) {
    const [showAllReviews, setShowAllReviews] = useState(false);

    const reviews = zoneData?.reviews || [];
    const zoneName = zoneData?.zoneName || "구역 이름";

    console.log("리뷰 개수:", reviews.length);
    console.log("리뷰 목록:", reviews);

    const rawAverageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + Number(r.reviewRating), 0) / reviews.length
        : 0;

    console.log("리뷰 평균:", rawAverageRating);

    const averageRating = Math.floor(rawAverageRating * 2) / 2;
    const displayLimit = 3;
    const displayedReviews = showAllReviews ? reviews : reviews.slice(0, displayLimit);

    return (
        <section className="mt-8 w-full select-none">
            <h2 className="gap-2.5 p-2.5 w-full text-2xl font-bold text-cblack">
                방문 후기
            </h2>

            <div className="flex flex-col justify-center px-2.5 py-5 mt-8 w-full text-center">
                <div className="w-full">
                    <p className="text-2xl font-bold text-cpurple">
                        <StarRating rating={averageRating} readOnly={true} />
                    </p>
                    <p className="mt-1.5 text-sm text-zinc-500">
                        {reviews.length}명 평가
                    </p>
                </div>
            </div>

            <div className="mt-8 text-sm text-right text-cpurple">
                {reviews.length > displayLimit && (
                    <button
                        onClick={() => setShowAllReviews(!showAllReviews)}
                        aria-expanded={showAllReviews}
                        aria-controls="zone-reviews-list"
                    >
                        {showAllReviews ? "간략히 보기" : "전체 보기"}
                    </button>
                )}
            </div>

            <div className="mt-8 w-full" id="zone-reviews-list">
                {reviews.length > 0 ? (
                    displayedReviews.map((reviewItem) => {
                        const url = reviewFirstImage(reviewItem.reviewPhotosJson);
                        const reviewDate = formatDateArray(reviewItem.createdAt);

                        return (
                            <ReviewCard
                                key={reviewItem.reviewId}
                                review={{
                                    campName: zoneName,
                                    site: reviewItem.siteName || "사이트",
                                    content: reviewItem.reviewContent,
                                    score: reviewItem.reviewRating.toString(),
                                    author: reviewItem.providerUserId || "익명",
                                    date: reviewDate,
                                }}
                                variant="long"
                                image={url}
                                site={reviewItem.siteName || "사이트"}
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

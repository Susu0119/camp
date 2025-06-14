"use client";
import React, { useState, useEffect } from "react";
import ReviewCard from "../../Main/UI/ReviewCard";
import StarRating from "../../Common/StarRating";
import { useAuth, apiCore } from "../../../utils/Auth";
import Swal from 'sweetalert2';
import ReportModal from "./ReportModal";
import { Badge } from "../../Common/Badge";

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
const reviewFirstImage = (reviewPhotos) => {
    if (!reviewPhotos) return null;

    const photoData = JSON.parse(reviewPhotos);
    return photoData?.photo_urls?.[0] || null;
};

export default function ReviewSection({ campgroundData, zoneData }) {
    const [showAllReviews, setShowAllReviews] = useState(false);
    const { user } = useAuth(); // 현재 로그인한 사용자 정보
    const [userNicknames, setUserNicknames] = useState({}); // provider_user_id -> nickname 매핑
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    // 캠핑장 데이터 또는 구역 데이터 구분해서 처리
    const isZoneReview = !!zoneData;

    const campgroundName = isZoneReview
        ? zoneData?.zoneName || "구역 이름"
        : campgroundData?.campground?.campground_name || "캠핑장 이름";

    const reviews = isZoneReview
        ? zoneData?.reviews || []
        : campgroundData?.reviews || [];

    const totalReviewCount = isZoneReview
        ? reviews.length
        : campgroundData?.totalReviewCount || 0;

    // 리뷰 작성자들의 닉네임을 가져오는 useEffect
    useEffect(() => {
        const fetchUserNicknames = async () => {
            if (!reviews || reviews.length === 0) return;

            // 중복 제거된 provider_user_id 목록 생성 (현재 로그인한 사용자 제외)
            const uniqueUserIds = [...new Set(reviews.map(review =>
                isZoneReview ? review.providerUserId : review.provider_user_id
            ))].filter(userId => userId !== user?.providerUserId); // 현재 사용자 제외

            const nicknamePromises = uniqueUserIds.map(async (userId) => {
                try {
                    // 각 사용자의 정보를 가져오는 API 호출
                    const response = await apiCore.get(`/api/user/mypage/1/${userId}`);
                    return {
                        userId,
                        nickname: response.data?.nickname || userId
                    };
                } catch (error) {
                    console.error(`사용자 ${userId} 정보 가져오기 실패:`, error);
                    return {
                        userId,
                        nickname: userId
                    };
                }
            });

            try {
                const nicknameResults = await Promise.all(nicknamePromises);
                const nicknameMap = {};
                nicknameResults.forEach(({ userId, nickname }) => {
                    nicknameMap[userId] = nickname;
                });

                // 현재 로그인한 사용자 닉네임도 매핑에 추가
                if (user?.providerUserId && user?.nickname) {
                    nicknameMap[user.providerUserId] = user.nickname;
                }

                setUserNicknames(nicknameMap);
            } catch (error) {
                console.error('닉네임 가져오기 실패:', error);
            }
        };

        fetchUserNicknames();
    }, [reviews, user]);

    const handleOpenReportModal = (reviewId, author) => {
        if (!user) {
            Swal.fire({
                icon: 'error',
                text: '로그인이 필요합니다.',
                confirmButtonColor: '#8C06AD'
            });
            return;
        }
        setSelectedReview({ reviewId, author });
        setIsReportModalOpen(true);
    };

    const handleCloseReportModal = () => {
        setIsReportModalOpen(false);
        setSelectedReview(null);
    };

    // 평균 별점 계산
    const rawAverageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => {
            const rating = isZoneReview ? review.reviewRating : review.review_rating;
            return sum + rating;
        }, 0) / reviews.length
        : 0;

    const averageRating = Math.round(rawAverageRating * 10) / 10;
    console.log(averageRating);

    // 표시할 리뷰 개수 (예: 처음에는 3개만 보여주고 싶다면)
    const displayLimit = 5;
    const displayedReviews = showAllReviews
        ? reviews // 전체 보기일 때는 모든 리뷰
        : reviews.slice(0, displayLimit); // 간략히 보기일 때는 처음 3개만

    // provider_user_id를 닉네임으로 변환하는 함수
    const getDisplayAuthor = (reviewItem) => {
        const userId = isZoneReview ? reviewItem.providerUserId : reviewItem.provider_user_id;

        // 매핑된 닉네임이 있으면 사용
        if (userNicknames[userId]) {
            return userNicknames[userId];
        }

        // 닉네임이 없으면 익명으로 표시
        return "익명";
    };

    return (
        <>
            <section className="mt-8 w-full max-md:max-w-full">
                <h2 className="gap-2.5 p-2.5 w-full text-2xl font-bold text-neutral-900 max-md:max-w-full">
                    방문 후기
                </h2>

                <div className="flex flex-col justify-center px-2.5 py-5 mt-8 w-full text-center max-md:max-w-full">
                    <div className="w-full max-md:max-w-full">
                        <div className="text-2xl items-center justify-center font-bold text-fuchsia-700 flex flex-row">
                            <StarRating rating={averageRating} readOnly={true} />
                            <div className="ml-2 py-0">
                                <Badge variant="card" className="text-xs">{averageRating}</Badge>
                            </div>
                        </div>
                        <div className="mt-1.5 text-sm text-zinc-500 max-md:max-w-full">
                            {totalReviewCount}명 평가
                        </div>
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
                            const url = isZoneReview
                                ? reviewFirstImage(reviewItem.reviewPhotosJson)
                                : reviewFirstImage(reviewItem.review_photos);

                            const reviewDate = isZoneReview
                                ? formatDateArray(reviewItem.createdAt)
                                : formatDateArray(reviewItem.created_at);

                            const siteName = isZoneReview
                                ? reviewItem.siteName || "사이트"
                                : reviewItem.site_name || "사이트 정보 없음";

                            const reviewContent = isZoneReview
                                ? reviewItem.reviewContent
                                : reviewItem.review_content;

                            const reviewRating = isZoneReview
                                ? reviewItem.reviewRating
                                : reviewItem.review_rating;

                            const reviewId = isZoneReview
                                ? reviewItem.reviewId
                                : reviewItem.review_id;

                            const displayAuthor = getDisplayAuthor(reviewItem); // 닉네임 변환
                            const authorId = isZoneReview ? reviewItem.providerUserId : reviewItem.provider_user_id;
                            const isMyReview = user && user.providerUserId === authorId;

                            return (
                                <ReviewCard
                                    key={reviewId}
                                    review={{
                                        reviewId: reviewId,
                                        CampName: campgroundName, // 동적으로 캠핑장/구역 이름 전달
                                        site: siteName, // 실제 사이트 이름 사용
                                        content: reviewContent,
                                        score: reviewRating.toString(),
                                        author: displayAuthor, // 변환된 닉네임 사용
                                        date: reviewDate,
                                    }}
                                    variant='long'
                                    image={url} // 기본 리뷰 이미지
                                    site={siteName} // ReviewCard의 site prop에 실제 사이트 이름 전달
                                    onReport={() => handleOpenReportModal(reviewId, displayAuthor)}
                                    isMyReview={isMyReview}
                                    isLoggedIn={!!user}
                                />
                            );
                        })
                    ) : (
                        <p className="text-center text-neutral-500 py-10">아직 작성된 리뷰가 없습니다.</p>
                    )}
                </div>
            </section>

            {isReportModalOpen && selectedReview && (
                <ReportModal
                    isOpen={isReportModalOpen}
                    onClose={handleCloseReportModal}
                    reviewId={selectedReview.reviewId}
                    author={selectedReview.author}
                />
            )}
        </>
    );
}
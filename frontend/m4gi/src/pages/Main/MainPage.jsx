"use client";

import React, { useState, useEffect } from 'react';
import { apiCore } from '../../utils/Auth';
import { useNavigate } from 'react-router-dom';
import { translateType } from '../../utils/Translate';
import Header from '../../components/Common/Header';
import CategorySection from '../../components/Main/UI/CategorySection';
import BannerSection from '../../components/Main/UI/BannerSection';
import CampingSiteSection from '../../components/Main/UI/CampingSiteSection';
import ReviewSection from '../../components/Main/UI/ReviewSection';
import Footer from '../../components/Main/UI/Footer';
import AppDownload from '../../components/Main/UI/AppDownload';

export default function MainPage() {
    const navigate = useNavigate();

    // 추천 캠핑장 데이터 상태
    const [recommendedSites, setRecommendedSites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleCategoryClick = (categoryValue) => {
        const params = new URLSearchParams();

        if (categoryValue === 'WISHLIST') { // '찜'은 value인 'WISHLIST'로 비교
            navigate('/main'); // 찜 페이지 경로로 수정 (예시)
            return;
        }

        if (['PET_ALLOWED', 'KIDS_ALLOWED'].includes(categoryValue)) {
            params.append('featureList', categoryValue);
        } else {
            params.append('campgroundTypes', categoryValue);
        }

        navigate(`/searchResult?${params.toString()}`);
    };

    // 추천 캠핑장 데이터 가져오기 (랜덤 30개)
    const loadRecommendedSites = async () => {
        try {
            setIsLoading(true);
            // 오늘 날짜와 내일 날짜 생성
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const response = await apiCore.get('/api/campgrounds/searchResult', {
                params: {
                    limit: 18,
                    campgroundName: '', // 빈 문자열로 모든 캠핑장 검색
                }
            });

            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                // API 응답 데이터를 Card 컴포넌트에 맞게 변환
                const transformedData = response.data.map(campground => {
                    return {
                        id: campground.campgroundId,
                        name: campground.campgroundName,
                        location: `${campground.addrSido} ${campground.addrSigungu}`,
                        type: translateType(campground.campgroundType),
                        score: parseFloat(campground.reviewRatingAvg) || 0,
                        price: campground.campgroundPrice || 0,
                        remainingSpots: campground.totalCurrentStock || 0,
                        image: campground.campgroundImage, // 백엔드에서 이미 thumbnail URL을 보내줌
                        isNew: false,
                        isWishlisted: campground.isWishlisted === 1
                    };
                });

                setRecommendedSites(transformedData);
            } else {
                console.log('API에서 빈 데이터 또는 배열이 아닌 데이터 응답');
                // 빈 데이터일 때 스켈레톤 데이터 생성 (skeleton: true 플래그)
                setRecommendedSites(Array.from({ length: 18 }, (_, index) => ({
                    id: `skeleton-${index}`,
                    skeleton: true
                })));
            }
        } catch (error) {
            console.error('추천 캠핑장 데이터 가져오기 실패:', error);
            // 에러 시 스켈레톤 데이터로 fallback
            setRecommendedSites(Array.from({ length: 18 }, (_, index) => ({
                id: `error-skeleton-${index}`,
                skeleton: true
            })));
        } finally {
            setIsLoading(false);
        }
    };

    // 인기 캠핑장 데이터 가져오기 (평점 높은 순)
    const loadPopularSites = async () => {
        try {
            const response = await apiCore.get('/api/campgrounds/searchResult', {
                params: {
                    campgroundName: '', // 빈 문자열로 모든 캠핑장 검색
                    limit: 6,
                    offset: 0, // 상위 6개
                    sortOption: 'rating_high', // 평점 높은 순
                    providerCode: 0,
                    providerUserId: ''
                }
            });

            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                const transformedData = response.data.map(campground => {
                    return {
                        id: campground.campgroundId,
                        name: campground.campgroundName,
                        location: `${campground.addrSido} ${campground.addrSigungu}`,
                        type: translateType(campground.campgroundType),
                        score: parseFloat(campground.reviewRatingAvg) || 0,
                        price: campground.campgroundPrice || 0,
                        remainingSpots: campground.totalCurrentStock || 0,
                        image: campground.campgroundImage, // 백엔드에서 이미 thumbnail URL을 보내줌
                        isNew: false,
                        isWishlisted: campground.isWishlisted === 1
                    };
                });

                setPopularSites(transformedData);
            } else {
                // 빈 데이터일 때 스켈레톤 표시
                setPopularSites(Array.from({ length: 6 }, (_, index) => ({
                    id: `popular-skeleton-${index}`,
                    skeleton: true
                })));
            }
        } catch (error) {
            console.error('인기 캠핑장 데이터 가져오기 실패:', error);
            // 에러 시 스켈레톤 표시
            setPopularSites(Array.from({ length: 6 }, (_, index) => ({
                id: `popular-error-skeleton-${index}`,
                skeleton: true
            })));
        }
    };

    // 신규 캠핑장 데이터 가져오기 (최신 등록 순)
    const loadNewSites = async () => {
        try {
            const response = await apiCore.get('/api/campgrounds/searchResult', {
                params: {
                    campgroundName: '', // 빈 문자열로 모든 캠핑장 검색
                    limit: 6,
                    offset: 0, // 상위 6개
                    sortOption: 'date_desc', // 최신 등록 순
                    providerCode: 0,
                    providerUserId: ''
                }
            });

            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                const transformedData = response.data.map(campground => {
                    return {
                        id: campground.campgroundId,
                        name: campground.campgroundName,
                        location: `${campground.addrSido} ${campground.addrSigungu}`,
                        type: translateType(campground.campgroundType),
                        score: parseFloat(campground.reviewRatingAvg) || 0,
                        price: campground.campgroundPrice || 0,
                        remainingSpots: campground.totalCurrentStock || 0,
                        image: campground.campgroundImage, // 백엔드에서 이미 thumbnail URL을 보내줌
                        isNew: true, // NEW 배지 표시
                        isWishlisted: campground.isWishlisted === 1
                    };
                });

                setNewSites(transformedData);
            } else {
                // 빈 데이터일 때 스켈레톤 표시
                setNewSites(Array.from({ length: 6 }, (_, index) => ({
                    id: `new-skeleton-${index}`,
                    skeleton: true
                })));
            }
        } catch (error) {
            console.error('신규 캠핑장 데이터 가져오기 실패:', error);
            // 에러 시 스켈레톤 표시
            setNewSites(Array.from({ length: 6 }, (_, index) => ({
                id: `new-error-skeleton-${index}`,
                skeleton: true
            })));
        }
    };

    // 컴포넌트 마운트 시 모든 데이터 가져오기
    useEffect(() => {
        loadRecommendedSites();
        loadPopularSites();
        loadNewSites();
        loadReviews();
    }, []);

    // 인기 캠핑장과 신규 캠핑장을 위한 state
    const [popularSites, setPopularSites] = useState([]);
    const [newSites, setNewSites] = useState([]);
    const [reviews, setReviews] = useState([]);

    // 한국 시간으로 날짜 포맷팅 함수
    const formatKoreanDate = (dateArray) => {
        if (!dateArray || !Array.isArray(dateArray)) {
            const now = new Date();
            return now.toISOString().split('T')[0];
        }

        // 배열 형태의 날짜 처리 (예: [2024, 12, 25, 14, 30, 0])
        const [year, month, day] = dateArray;
        const date = new Date(year, month - 1, day); // month는 0부터 시작
        return date.toISOString().split('T')[0];
    };

    // 리뷰 데이터 가져오기 (최신 8개)
    const loadReviews = async () => {
        try {
            const response = await apiCore.get('/api/reviews/public/list', {
                params: {
                    page: 0,
                    size: 50 // 4점 이상 필터링을 위해 더 많이 가져오기
                }
            });

            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                // 평점 4점 이상인 리뷰만 필터링
                const highRatedReviews = response.data.filter(review =>
                    parseFloat(review.reviewRating) >= 4.0
                ).slice(0, 8); // 최대 8개만 선택

                if (highRatedReviews.length === 0) {
                    console.log('평점 4점 이상인 리뷰가 없습니다.');
                    setReviews([]);
                    return;
                }

                // 중복 제거된 provider_user_id 목록 생성
                const uniqueUserIds = [...new Set(highRatedReviews.map(review => review.providerUserId))];

                // 각 사용자의 닉네임을 가져오기
                const nicknamePromises = uniqueUserIds.map(async (userId) => {
                    try {
                        const userResponse = await apiCore.get(`/api/user/mypage/1/${userId}`);
                        return {
                            userId,
                            nickname: userResponse.data?.nickname || '익명'
                        };
                    } catch (error) {
                        console.error(`사용자 ${userId} 정보 가져오기 실패:`, error);
                        return {
                            userId,
                            nickname: '익명'
                        };
                    }
                });

                const nicknameResults = await Promise.all(nicknamePromises);
                const nicknameMap = {};
                nicknameResults.forEach(({ userId, nickname }) => {
                    nicknameMap[userId] = nickname;
                });

                // 각 리뷰의 campgroundId로 캠핑장 이름 가져오기
                const reviewsWithCampgroundNames = await Promise.all(
                    highRatedReviews.map(async (review) => {
                        let campgroundName = '캠핑장';

                        try {
                            // campgroundId로 캠핑장 정보 조회
                            const campgroundResponse = await apiCore.get(`/api/campgrounds/${review.campgroundId}`);
                            campgroundName = campgroundResponse.data?.campground?.campground_name || '캠핑장';
                        } catch (error) {
                            console.error(`캠핑장 정보 조회 실패 (ID: ${review.campgroundId}):`, error);
                        }

                        return {
                            campName: campgroundName,
                            score: parseFloat(review.reviewRating) || 0,
                            content: review.reviewContent || '',
                            author: nicknameMap[review.providerUserId] || '익명',
                            date: formatKoreanDate(review.createdAt)
                        };
                    })
                );

                setReviews(reviewsWithCampgroundNames);
            } else {
                console.log('리뷰 API에서 빈 데이터 응답');
                // 빈 데이터일 때 기본 메시지 또는 빈 배열
                setReviews([]);
            }
        } catch (error) {
            console.error('리뷰 데이터 가져오기 실패:', error);
            // 에러 시 빈 배열로 fallback
            setReviews([]);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <main className="flex relative flex-col justify-center w-full bg-white max-w-[1920px] min-h-[900px]">
                <Header showSearchBar={true} />

                <div className="flex overflow-hidden z-0 flex-col flex-1 items-center pt-3.5 pb-8 mt-2.5 w-full">
                    <CategorySection onCategoryClick={handleCategoryClick} />
                    <BannerSection />

                    <CampingSiteSection
                        title="추천 캠핑장"
                        sites={isLoading ? [] : recommendedSites}
                        variant="grid"
                        backgroundColor="bg-[#EDDDF4]"
                    />

                    <CampingSiteSection
                        title="인기 캠핑장"
                        sites={popularSites}
                        variant="horizontal"
                    />

                    <CampingSiteSection
                        title="신규 입점 캠핑장"
                        sites={newSites}
                        variant="new"
                    />

                    <ReviewSection reviews={reviews} />
                </div>

                <Footer />
                <AppDownload />
            </main>
        </div>
    );
}
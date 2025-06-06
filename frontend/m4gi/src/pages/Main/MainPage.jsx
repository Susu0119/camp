"use client";

import React, { useState, useEffect } from 'react';
import { apiCore } from '../../utils/Auth';
import Header from '../../components/Common/Header';
import CategorySection from '../../components/Main/UI/CategorySection';
import BannerSection from '../../components/Main/UI/BannerSection';
import CampingSiteSection from '../../components/Main/UI/CampingSiteSection';
import ReviewSection from '../../components/Main/UI/ReviewSection';
import Footer from '../../components/Main/UI/Footer';
import AppDownload from '../../components/Main/UI/AppDownload';

export default function MainPage() {
    // 추천 캠핑장 데이터 상태
    const [recommendedSites, setRecommendedSites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 추천 캠핑장 데이터 가져오기 (랜덤 30개)
    const fetchRecommendedSites = async () => {
        try {
            setIsLoading(true);
            // 오늘 날짜와 내일 날짜 생성
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const formatDate = (date) => {
                return date.toISOString().split('T')[0];
            };

            const response = await apiCore.get('/api/campgrounds/searchResult', {
                params: {
                    campgroundName: '', // 빈 문자열로 모든 캠핑장 검색
                    checkInDate: formatDate(today),
                    checkOutDate: formatDate(tomorrow),
                    capacity: 2, // 기본 2명
                    limit: 18,
                    offset: Math.floor(Math.random() * 50) // 오프셋을 줄여서 더 안정적으로
                }
            });

            // API 응답 확인 및 데이터 변환
            console.log('API 응답:', response);
            console.log('API 응답 데이터:', response.data);
            console.log('응답 상태:', response.status);
            console.log('데이터 타입:', typeof response.data);
            console.log('배열인가?:', Array.isArray(response.data));
            console.log('데이터 길이:', response.data?.length);

            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                // API 응답 데이터를 Card 컴포넌트에 맞게 변환
                const transformedData = response.data.map(campground => {
                    // campgroundImage JSON 파싱
                    let imageUrl = null;
                    try {
                        if (campground.campgroundImage) {
                            const imageData = JSON.parse(campground.campgroundImage);
                            imageUrl = imageData.url;
                        }
                    } catch (error) {
                        console.error('이미지 JSON 파싱 실패:', error);
                    }

                    return {
                        id: campground.campgroundId,
                        name: campground.campgroundName,
                        location: `${campground.addrSido} ${campground.addrSigungu}`,
                        type: campground.campgroundTypeString,
                        score: parseFloat(campground.reviewRatingAvg) || 0,
                        price: campground.campgroundPrice || 0,
                        remainingSpots: campground.totalCurrentStock || 0,
                        image: imageUrl,
                        isNew: false,
                        isWishlisted: campground.isWishlisted === 1
                    };
                });

                setRecommendedSites(transformedData);
            } else {
                console.log('API에서 빈 데이터 또는 배열이 아닌 데이터 응답');
                // 빈 데이터일 때 기본 데이터 사용
                setRecommendedSites(Array(12).fill({
                    name: "대구 가창농원 글램핑 & 캠핑장",
                    location: "대구시 달성군",
                    type: "캠핑 글램핑",
                    score: 3.5,
                    price: 50000,
                    remainingSpots: 14,
                    image: "https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/6f9b36439ff18c619e4c7295ba6fbee07f5d15b1?placeholderIfAbsent=true"
                }));
            }
        } catch (error) {
            console.error('추천 캠핑장 데이터 가져오기 실패:', error);
            // 에러 시 기본 데이터로 fallback
            setRecommendedSites(Array(12).fill({
                name: "대구 가창농원 글램핑 & 캠핑장",
                location: "대구시 달성군",
                type: "캠핑 글램핑",
                score: 3.5,
                price: 50000,
                remainingSpots: 14,
                image: "https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/6f9b36439ff18c619e4c7295ba6fbee07f5d15b1?placeholderIfAbsent=true"
            }));
        } finally {
            setIsLoading(false);
        }
    };

    // 컴포넌트 마운트 시 데이터 가져오기
    useEffect(() => {
        fetchRecommendedSites();
    }, []);

    // Sample data for popular camping sites
    const popularSites = Array(6).fill({
        name: "대구 가창농원 글램핑 & 캠핑장",
        location: "대구시 달성군",
        type: "캠핑 글램핑",
        score: 4,
        price: 40000,
        remainingSpots: 24,
        image: "https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/b757033fa5928c7358587c2394792326c2baf98d?placeholderIfAbsent=true"
    });

    // Sample data for new camping sites
    const newSites = Array(6).fill({
        name: "대구 가창농원 글램핑 & 캠핑장",
        location: "대구시 달성군",
        type: "캠핑 글램핑",
        score: 4,
        price: 40000,
        remainingSpots: 6,
        image: "https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/b757033fa5928c7358587c2394792326c2baf98d?placeholderIfAbsent=true"
    });

    // Sample data for reviews
    const reviews = [
        {
            campName: "숲속 캠핑장",
            score: 5,
            content: "정말 좋은 캠핑장이었습니다. 시설도 깨끗하고 직원분들도 친절했어요.",
            author: "김캠핑",
            date: "2023-05-15"
        },
        {
            campName: "바다 뷰 글램핑",
            score: 4,
            content: "바다가 보이는 뷰가 정말 좋았습니다. 다만 주변에 편의시설이 조금 부족했어요.",
            author: "이글램",
            date: "2023-05-10"
        },
        {
            campName: "산골 카라반",
            score: 5,
            content: "카라반 시설이 정말 좋았습니다. 다음에 또 방문하고 싶어요!",
            author: "박카라",
            date: "2023-05-05"
        },
        {
            campName: "계곡 캠핑장",
            score: 4,
            content: "계곡 소리를 들으며 잠들 수 있어서 좋았어요. 화장실이 조금 멀었던 점이 아쉬웠습니다.",
            author: "최캠퍼",
            date: "2023-05-02"
        },
        {
            campName: "하늘정원 캠핑장",
            score: 5,
            content: "밤하늘의 별이 정말 예뻤어요. 조용하고 한적한 분위기가 좋았습니다.",
            author: "정글램",
            date: "2024-11-28"
        },
        {
            campName: "달빛 글램핑",
            score: 4,
            content: "시설이 깨끗하고 관리가 잘 되어있었어요. 다음에 또 방문할 예정입니다.",
            author: "강캠핑",
            date: "2025-04-29"
        },
        {
            campName: "뉴캠프 글램핑",
            score: 4,
            content: "시설이 너무 좋고 주변 환경도 좋아요. 다음에 또 방문할 예정입니다.",
            author: "주캠퍼",
            date: "2025-04-27"
        },
        {
            campName: "베이스캠프 캠핑장",
            score: 4.5,
            content: "시설이 너무 좋고 가까워서 좋아요. 많이 이용할 것 같아요.",
            author: "주캠퍼",
            date: "2025-04-25"
        }
    ];

    return (
        <div className="flex flex-col justify-center items-center">
            <main className="flex relative flex-col justify-center w-full bg-white max-w-[1920px] min-h-[900px]">
                <Header showSearchBar={true} />

                <div className="flex overflow-hidden z-0 flex-col flex-1 items-center pt-3.5 pb-8 mt-2.5 w-full">
                    <CategorySection />
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
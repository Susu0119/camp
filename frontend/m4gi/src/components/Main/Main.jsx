"use client";

import React from 'react';
import Header from '../UI/Header';
import CategorySection from './CategorySection';
import BannerSection from './BannerSection';
import CampingSiteSection from './CampingSiteSection';
import ReviewSection from './ReviewSection';
import Footer from './Footer';
import AppDownload from './AppDownload';

export default function MainPage() {
    // Sample data for recommended camping sites
    const recommendedSites = Array(6).fill({
        name: "대구 가창농원 글램핑 & 캠핑장",
        location: "대구시 달성군",
        type: "캠핑 글램핑",
        score: 3.5,
        price: 50000,
        remainingSpots: 14,
        image: "https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/6f9b36439ff18c619e4c7295ba6fbee07f5d15b1?placeholderIfAbsent=true"
    });

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
                        sites={recommendedSites}
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
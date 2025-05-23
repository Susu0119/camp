"use client";
import React from "react";
import ReviewCard from "../../Main/UI/ReviewCard";
import StarRating from "../../Common/StarRating";

const reviews = {
    CampName: "대구 가창 농원 글램핑 & 캠핑장",
    site: "캠핑 A동",
    image: "https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/51e139e6e6885e0fa4818c2fcc7b81e4b0cbc5e0?placeholderIfAbsent=true",
    score: "4",
    content: "물소리와 새소리가 어우러진 자연 속에서 정말 평화로운 시간을 보냈어요. 사이트 간 간격도 넓어서 프라이버시가 잘 지켜졌고, 전기와 온수도 잘 나와서 불편함 없이 지낼 수 있었어요. 화장실과 샤워실도 깔끔하게 관리되고 있어서 만족스러웠고, 주변 산책로도 잘 정비돼 있어 산책하며 힐링하기에 딱 좋은 캠핑장이었어요.",
    author: "김철수",
    date: "2025-05-12"
}

export default function ReviewSection() {
    return (
        <section className="mt-8 w-full max-md:max-w-full">
            <h2 className="gap-2.5 p-2.5 w-full text-2xl font-bold text-neutral-900 max-md:max-w-full">
                방문 후기
            </h2>

            <div className="flex flex-col justify-center px-2.5 py-5 mt-8 w-full text-center max-md:max-w-full">
                <div className="w-full max-md:max-w-full">
                    <p className="text-2xl font-bold text-fuchsia-700 max-md:max-w-full">
                        <StarRating rating={4} readOnly={true} />
                    </p>
                    <p className="mt-1.5 text-sm text-zinc-500 max-md:max-w-full">
                        2명 평가
                    </p>
                </div>
            </div>

            <div className="mt-8 text-sm text-right text-fuchsia-700 max-md:max-w-full">
                <button>전체 보기</button>
            </div>

            <div className="mt-8 w-full max-md:max-w-full">
                <ReviewCard review={reviews} variant='long' image={reviews.image} site={reviews.site} />
            </div>
        </section>
    );
}
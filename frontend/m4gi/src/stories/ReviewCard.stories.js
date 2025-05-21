// ReviewCard.stories.jsx (또는 .js, .tsx)

import React from 'react';
import ReviewCard from '../components/Main/UI/ReviewCard';

export default {
    title: 'Components/ReviewCard',
    component: ReviewCard,
    tags: ['autodocs'], // Storybook 8.x 자동 문서 생성 태그
    parameters: {
        layout: 'centered', // 컴포넌트를 스토리 중앙에 배치
    },

};

// 기본 리뷰 데이터 예시
const defaultReviewData = {
    campName: "햇살 가득 캠핑장",
    score: 4, // StarRating의 rating={score}로 전달됩니다.
    content: "시설도 깔끔하고, 주변 경치도 좋아서 잘 쉬다 왔습니다. 아이들이 특히 좋아했어요!",
    author: "행복한캠퍼",
    date: "2024-05-21",
};

export const Default = {
    args: {
        review: defaultReviewData,
    },
};


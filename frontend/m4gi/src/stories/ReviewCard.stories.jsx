// ReviewCard.stories.jsx

import React from 'react';
import ReviewCard from '../components/Main/UI/ReviewCard';

export default {
    title: 'Components/ReviewCard',
    component: ReviewCard,
    tags: ['autodocs'],
    argTypes: {
        campName: { control: 'text', name: '캠핑장 이름' },
        score: { control: 'number', name: '평점' },
        content: { control: 'text', name: '내용' },
        author: { control: 'text', name: '작성자' },
        date: { control: 'date', name: '날짜' },
    },
    parameters: {
        layout: 'centered',
    },
};

const dateFormat = (dateInput) => {
    if (!dateInput) {
        return ""; // 날짜 입력이 없으면 빈 문자열 반환
    }

    const dateObj = new Date(dateInput); // 타임스탬프, Date 객체, 날짜 문자열 등으로부터 Date 객체 생성 시도

    // 유효한 Date 객체인지 확인
    if (dateObj instanceof Date && !isNaN(dateObj.valueOf())) {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // getMonth()는 0부터 시작
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
};

const Template = ({ campName, score, content, author, date }) => {
    const reviewData = {
        campName,
        score,
        content,
        author,
        date: dateFormat(date),
    };
    return <ReviewCard review={reviewData} />;
};

export const Primary = Template.bind({});
Primary.args = {
    campName: "기본 캠핑장 이름",
    score: 3,
    content: "기본 리뷰 내용입니다.",
    author: "기본 작성자",
    date: new Date(),
};
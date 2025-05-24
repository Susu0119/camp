// ReviewCard.stories.jsx

import React from 'react';
import Card from '../components/Main/UI/Card';

export default {
    title: 'Components/Card',
    component: Card,
    tags: ['autodocs'],
    argTypes: {
        name: { control: 'text', name: '캠핑장 이름' },
        location: { control: 'text', name: '위치' },
        type: { control: 'text', name: '캠핑장 유형' },
        score: { control: 'number', name: '평점' },
        price: { control: 'number', name: '가격' },
        remainingSpots: { control: 'number', name: '남은 자리' },
        image: { control: 'text', name: '이미지' },
        isNew: { control: 'boolean', name: '신규 캠핑장 여부' },
    },
    parameters: {
        layout: 'fullscreen',
    },
};

const Template = (args) => {
    const { variant, ...siteData } = args;
    return <Card site={siteData} variant={variant} />;
};

export const Primary = Template.bind({});
Primary.args = {
    name: "기본 캠핑장 이름",
    location: "기본 위치",
    type: "기본 유형",
    score: 3,
    price: 100000,
    remainingSpots: 10,
    image: "/1.png",
    isNew: true,
    variant: "default"
};

export const small = Template.bind({});
small.args = {
    ...Primary.args, // Primary의 args를 기본으로 사용
    variant: "small"
};

export const long = Template.bind({});
long.args = {
    ...Primary.args, // Primary의 args를 기본으로 사용
    variant: "long"
};
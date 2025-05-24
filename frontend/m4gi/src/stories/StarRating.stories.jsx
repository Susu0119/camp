// StarRating.stories.jsx
import * as React from 'react';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';

const DynamicStarRating = ({ rating, readOnly, size, precision, filledColor, hoverColor }) => {
    const DynamicStyledRating = styled(Rating)({
        '& .MuiRating-iconFilled': {
            color: filledColor || '#8C06AD',
        },
        '& .MuiRating-iconHover': {
            color: hoverColor || '#7A2A8A',
        },
    });

    return (
        <DynamicStyledRating
            name="rating"
            value={rating}
            precision={precision || 0.5}
            readOnly={readOnly}
            size={size}
        />
    );
};

export default {
    title: 'Components/StarRating',
    component: DynamicStarRating, 
    tags: ['autodocs'],
    argTypes: {

        rating: { 
            control: { type: 'number', min: 0, max: 5, step: 0.1 }, 
            description: '별점 값 (0-5)',
            name: '별점'
        },
        readOnly: { 
            control: 'boolean', 
            description: '읽기 전용 여부',
            name: '읽기 전용'
        },
        size: { 
            control: { type: 'select' },
            options: ['small', 'medium', 'large'],
            description: '별 크기',
            name: '크기'
        },
        precision: {
            control: { type: 'select' },
            options: [0.1, 0.5, 1],
            description: '별점 단위 (0.1, 0.5, 1)',
            name: '정밀도'
        },
        filledColor: {
            control: 'color',
            description: '채워진 별 색상',
            name: '채워진 별 색상'
        },
        hoverColor: {
            control: 'color',
            description: '호버 시 별 색상',
            name: '호버 색상'
        },
    },
    parameters: {
        layout: 'centered',
    },
};

// 기본 별점 (읽기 전용)
export const Primary = {
    args: {
        rating: 3,
        readOnly: true,
        size: 'small',
        precision: 0.5,
        filledColor: '#8C06AD',
        hoverColor: '#7A2A8A'
    },
};

// 편집 가능한 별점
export const Secondary = {
    args: {
        rating: 3,
        readOnly: false,
        size: 'small',
        precision: 0.5,
        filledColor: '#8C06AD',
        hoverColor: '#7A2A8A'
    },
};


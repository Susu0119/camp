import * as React from 'react';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';

const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#8C06AD',
    },
    '& .MuiRating-iconHover': {
        color: '#7A2A8A',
    },
});

export default function StarRating({ rating, onRate, readOnly = false, size = 'small' }) {
    const handleChange = (event, newValue) => {
        if (!readOnly && onRate) {
            onRate(newValue); // 부모의 setRating(newValue) 호출
        }
    };

    return (
        <StyledRating
            name="rating"
            value={rating}
            precision={0.1}
            readOnly={readOnly}
            onChange={handleChange}
            size={size}
        />
    );
}

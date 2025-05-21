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

export default function StarRating({ rating, readOnly = false, size = 'small' }) {
    return (
        <StyledRating
            name="rating"
            value={rating}
            precision={0.5}
            readOnly={readOnly}
            size={size}
        />
    );
}

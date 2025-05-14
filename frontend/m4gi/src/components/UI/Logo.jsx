import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo() {
    return (
        <Link to="/starry">
            <div className="flex select-none items-center justify-center">
                <span className="font-['Gapyeong_Wave'] text-3xl font-normal leading-[44px] text-[#6e0488]">
                    Campia
                </span>
            </div>
        </Link>
    );
};
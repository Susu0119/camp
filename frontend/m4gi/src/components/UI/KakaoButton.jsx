// components/ui/KakaoButton.jsx
import React from 'react';

const VARIANTS = {
    cont: {
        image: 'https://developers.kakao.com/tool/resource/static/img/button/login/simple/ko/kakao_login_large.png',
        width: 'w-[80px]',
    },
    short: {
        image: 'https://developers.kakao.com/tool/resource/static/img/button/login/full/ko/kakao_login_large_narrow.png',
        width: 'w-[160px]',
    },
    long: {
        image: 'https://developers.kakao.com/tool/resource/static/img/button/login/full/ko/kakao_login_large_wide.png',
        width: 'w-[260px]',
    },
};

export function KakaoButton({
    variant = 'cont',       // 'cont' | 'short' | 'long'
    image,                  // 직접 URL을 덮어쓰고 싶으면 전달
    alt = '카카오 로그인',
    className = '',
    ...props
}) {
    const { image: src, width } = VARIANTS[variant] || VARIANTS.cont;

    return (
        <button
            {...props}
            className={`relative select-none cursor-pointer m-4 border-none bg-transparent ${width} ${className}`}
        /* 버튼 자체에 inline style 지우기! */
        >
            <img src={src} alt={alt} className="block w-full h-auto" />
        </button>
    );
}

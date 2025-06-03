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

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_REST_KEY
    }&redirect_uri=${encodeURIComponent(import.meta.env.VITE_KAKAO_REDIRECT_URI)
    }&response_type=code`;

export default function KakaoButton({
    variant = 'cont',       // 'cont' | 'short' | 'long'
    image,                  // 직접 URL을 덮어쓰고 싶으면 전달
    alt = '카카오 로그인',
    className = '',
    ...props
}) {
    const { image: src } = VARIANTS[variant] || VARIANTS.cont;

    const handleClick = () => {
        window.location.href = KAKAO_AUTH_URL; // 클릭 시 카카오 로그인 URL로 이동
    };

    return (
        <button
            onClick={handleClick}
            {...props}
            className={`w-full relative select-none cursor-pointer border-none bg-transparent ${className}`}
        >
            <img src={src} alt={alt} className="block w-full h-auto" />
        </button>
    );
}

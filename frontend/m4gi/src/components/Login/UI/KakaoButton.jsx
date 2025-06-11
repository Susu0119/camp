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

// 동적으로 현재 호스트를 사용하여 redirect_uri 생성
const getCurrentHost = () => {
    return window.location.origin; // http://34.168.101.140 또는 http://localhost:5173
};

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_REST_KEY || '5f4515b5278ab8f945dbf700c9779554'
    }&redirect_uri=${encodeURIComponent(getCurrentHost() + '/oauth/kakao/callback')
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

import React, { useMemo } from 'react';

export default function StarryHeader({
    starCount = 200,    // 별 개수
    className = '',    // 추가 스타일이 필요하면        // 헤더 중앙에 텍스트나 로고를 넣고 싶을 때
}) {
    // 랜덤 위치·크기·애니메이션 세팅
    const stars = useMemo(() =>
        Array.from({ length: starCount }, (_, i) => ({
            id: i,
            top: Math.random() * 100,             // % 단위
            left: Math.random() * 100,
            size: Math.random() * 7 + 1.5,           // px 단위
            delay: Math.random() * 2,               // s
            duration: 1.5 + Math.random() * 0.02,     // s
        })), [starCount]
    );

    return (
        <header
            className={
                `select-none relative overflow-hidden h-30 bg-gradient-to-b ` +
                `from-black via-violet-950 to-white` +
                className
            }
        >
            {/* 별 찍기 */}
            {stars.map(star => (
                <span
                    key={star.id}
                    className="sparkle"
                    style={{
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        transform: `translate(-50%, -50%)`,
                        animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
                    }}
                />
            ))}

            <div className="relative z-10 flex items-center justify-center h-full text-white">
            </div>

        </header>
    );
}

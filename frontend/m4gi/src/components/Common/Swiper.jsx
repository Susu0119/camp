import React, { useState, useEffect, useRef } from 'react';

export default function Swiper({
    children,
    autoplay = false,
    autoplayDelay = 3000,
    showNavigation = true,
    showPagination = true,
    renderExternalPagination = null,
    loop = true,
    slidesPerView = 1,
    slidesPerColumn = 1,
    spaceBetween = 0,
    className = "",
    onSlideChange = null,
    breakpoints = null
}) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [currentBreakpoint, setCurrentBreakpoint] = useState(null);
    const autoplayRef = useRef(null);
    const swiperRef = useRef(null);

    // children을 배열로 변환
    const slides = React.Children.toArray(children);
    const totalSlides = slides.length;

    // 현재 breakpoint에 따른 설정 가져오기
    const getCurrentSettings = () => {
        if (breakpoints && currentBreakpoint) {
            return { slidesPerView: currentBreakpoint.slidesPerView || slidesPerView, slidesPerColumn: currentBreakpoint.slidesPerColumn || slidesPerColumn, spaceBetween: currentBreakpoint.spaceBetween || spaceBetween };
        }
        return { slidesPerView, slidesPerColumn, spaceBetween };
    };

    const { slidesPerView: currentSlidesPerView, slidesPerColumn: currentSlidesPerColumn, spaceBetween: currentSpaceBetween } = getCurrentSettings();

    // 그리드 모드에서 한 페이지당 표시할 슬라이드 수
    const slidesPerPage = currentSlidesPerView * currentSlidesPerColumn;
    
    // 실제 페이지 수 계산
    const totalPages = Math.ceil(totalSlides / slidesPerPage);
    const maxSlideIndex = totalPages - 1;

    // 반응형 breakpoint 처리
    useEffect(() => {
        if (!breakpoints) return;

        const handleResize = () => {
            const width = window.innerWidth;
            let matchedBreakpoint = null;

            // breakpoints를 큰 값부터 확인
            const sortedBreakpoints = Object.keys(breakpoints)
                .map(Number)
                .sort((a, b) => b - a);

            for (const bp of sortedBreakpoints) {
                if (width >= bp) {
                    matchedBreakpoint = breakpoints[bp];
                    break;
                }
            }

            setCurrentBreakpoint(matchedBreakpoint);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoints]);

    // 자동재생 시작
    const startAutoplay = () => {
        if (autoplay && totalPages > 1) {
            autoplayRef.current = setInterval(() => {
                goToNext();
            }, autoplayDelay);
        }
    };

    // 자동재생 중지
    const stopAutoplay = () => {
        if (autoplayRef.current) {
            clearInterval(autoplayRef.current);
            autoplayRef.current = null;
        }
    };

    // 다음 슬라이드로 이동
    const goToNext = () => {
        if (isTransitioning) return;
        
        setIsTransitioning(true);
        if (loop) {
            setCurrentSlide(prev => (prev + 1) % totalPages);
        } else {
            setCurrentSlide(prev => Math.min(prev + 1, maxSlideIndex));
        }
        
        setTimeout(() => setIsTransitioning(false), 300);
    };

    // 이전 슬라이드로 이동
    const goToPrev = () => {
        if (isTransitioning) return;
        
        setIsTransitioning(true);
        if (loop) {
            setCurrentSlide(prev => (prev - 1 + totalPages) % totalPages);
        } else {
            setCurrentSlide(prev => Math.max(prev - 1, 0));
        }
        
        setTimeout(() => setIsTransitioning(false), 300);
    };

    // 특정 슬라이드로 이동
    const goToSlide = (index) => {
        if (isTransitioning || index === currentSlide) return;
        
        setIsTransitioning(true);
        setCurrentSlide(Math.min(index, maxSlideIndex));
        setTimeout(() => setIsTransitioning(false), 300);
    };

    // 자동재생 관리
    useEffect(() => {
        startAutoplay();
        return () => stopAutoplay();
    }, [autoplay, autoplayDelay, totalPages]);

    // 슬라이드 변경 콜백
    useEffect(() => {
        if (onSlideChange) {
            onSlideChange(currentSlide);
        }
    }, [currentSlide, onSlideChange]);

    // 마우스 호버 시 자동재생 일시정지
    const handleMouseEnter = () => {
        if (autoplay) stopAutoplay();
    };

    const handleMouseLeave = () => {
        if (autoplay) startAutoplay();
    };

    // 외부 페이지네이션 렌더링
    useEffect(() => {
        if (renderExternalPagination) {
            renderExternalPagination({
                totalSlides: totalPages,
                currentSlide,
                goToSlide,
                isTransitioning
            });
        }
    }, [currentSlide, totalPages, renderExternalPagination, isTransitioning]);

    if (totalSlides === 0) {
        return <div className={`swiper-container ${className}`}>슬라이드가 없습니다.</div>;
    }

    // Transform 계산 - 완전히 범용적
    const getTransformValue = () => {
        if (currentSlidesPerColumn > 1) {
            // 그리드 모드: 전체 페이지 단위로 이동
            return `translateX(-${currentSlide * 100}%)`;
        } else {
            // 일반 모드: slidesPerPage 단위로 이동
            const movePercent = currentSlide * (100 / currentSlidesPerView);
            return `translateX(-${movePercent}%)`;
        }
    };

    // 슬라이드 배치 방식 결정
    const renderSlides = () => {
        if (currentSlidesPerColumn > 1) {
            // 그리드 모드
            const pages = [];
            for (let i = 0; i < totalPages; i++) {
                const pageSlides = slides.slice(i * slidesPerPage, (i + 1) * slidesPerPage);
                pages.push(
                    <div
                        key={i}
                        className="w-full flex-shrink-0 grid"
                        style={{
                            gridTemplateColumns: `repeat(${currentSlidesPerView}, 1fr)`,
                            gridTemplateRows: `repeat(${currentSlidesPerColumn}, 1fr)`,
                            gap: `${currentSpaceBetween}px`
                        }}
                    >
                        {pageSlides.map((slide, slideIndex) => (
                            <div key={slideIndex}>
                                {slide}
                            </div>
                        ))}
                    </div>
                );
            }
            return pages;
        } else {
            // 일반 모드
            return slides.map((slide, index) => (
                <div
                    key={index}
                    className="flex-shrink-0"
                    style={{ 
                        width: `${100 / currentSlidesPerView}%`,
                        paddingRight: index < slides.length - 1 ? `${currentSpaceBetween / 2}px` : '0',
                        paddingLeft: index > 0 ? `${currentSpaceBetween / 2}px` : '0'
                    }}
                >
                    {slide}
                </div>
            ));
        }
    };

    return (
        <div 
            ref={swiperRef}
            className={`relative w-full overflow-hidden ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* 슬라이드 컨테이너 */}
            <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{
                    transform: getTransformValue()
                }}
            >
                {renderSlides()}
            </div>

            {/* 네비게이션 버튼 */}
            {showNavigation && totalPages > 1 && (
                <>
                    <button
                        onClick={goToPrev}
                        disabled={!loop && currentSlide === 0}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={goToNext}
                        disabled={!loop && currentSlide === maxSlideIndex}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* 내부 페이지네이션 도트 (외부 렌더링이 없을 때만) */}
            {showPagination && totalPages > 1 && !renderExternalPagination && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                index === currentSlide 
                                    ? 'bg-white w-6' 
                                    : 'bg-white/50 hover:bg-white/75'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
} 
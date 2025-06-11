import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Swiper as SwiperCore, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

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

    // 실제 페이지 수 계산 - BannerSection과 같은 일반 슬라이더를 위해 수정
    const totalPages = currentSlidesPerColumn > 1
        ? Math.ceil(totalSlides / slidesPerPage)  // 그리드 모드
        : totalSlides; // 일반 모드: 슬라이드 수와 동일
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

    // 네비게이션 함수들 - 공식 Swiper API 사용
    const goToNext = useCallback(() => {
        if (swiperRef.current && !isTransitioning) {
            setIsTransitioning(true);
            swiperRef.current.slideNext();
            setTimeout(() => setIsTransitioning(false), 250);
        }
    }, [isTransitioning]);

    const goToPrev = useCallback(() => {
        if (swiperRef.current && !isTransitioning) {
            setIsTransitioning(true);
            swiperRef.current.slidePrev();
            setTimeout(() => setIsTransitioning(false), 250);
        }
    }, [isTransitioning]);

    const goToSlide = useCallback((index) => {
        if (swiperRef.current && !isTransitioning) {
            setIsTransitioning(true);
            swiperRef.current.slideTo(index);
            setTimeout(() => setIsTransitioning(false), 250);
        }
    }, [isTransitioning]);

    // 마우스 호버 시 자동재생 처리
    const handleMouseEnter = () => {
        // 공식 Swiper에서 자동재생 처리
    };

    const handleMouseLeaveContainer = () => {
        // 공식 Swiper에서 자동재생 처리
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



    // 슬라이드 배치 방식 결정 - 공식 Swiper 사용
    const renderSlides = () => {
        if (currentSlidesPerColumn > 1) {
            // 그리드 모드: 페이지별로 그룹화
            const pages = [];
            for (let i = 0; i < totalPages; i++) {
                const pageSlides = slides.slice(i * slidesPerPage, (i + 1) * slidesPerPage);
                pages.push(
                    <SwiperSlide key={i}>
                        <div
                            className="w-full grid"
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
                    </SwiperSlide>
                );
            }
            return pages;
        } else {
            // 일반 모드: 각 슬라이드를 SwiperSlide로 감싸기
            return slides.map((slide, index) => (
                <SwiperSlide key={index}>
                    <div
                        style={{
                            paddingRight: `${currentSpaceBetween / 2}px`,
                            paddingLeft: `${currentSpaceBetween / 2}px`
                        }}
                    >
                        {slide}
                    </div>
                </SwiperSlide>
            ));
        }
    };

    return (
        <div
            className={`relative w-full overflow-hidden select-none ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeaveContainer}
        >
            {/* 공식 Swiper 사용하되 기존 스타일 유지 */}
            <SwiperCore
                ref={swiperRef}
                modules={[Autoplay]}
                slidesPerView={currentSlidesPerColumn > 1 ? 1 : currentSlidesPerView}
                spaceBetween={currentSlidesPerColumn > 1 ? 0 : currentSpaceBetween}
                navigation={false}
                pagination={false}
                autoplay={autoplay && totalPages > 1 ? {
                    delay: autoplayDelay,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                } : false}
                loop={loop && totalPages > 1}
                onSlideChange={(swiper) => {
                    // 루프 모드일 때는 realIndex, 아닐 때는 activeIndex 사용
                    const newIndex = loop ? swiper.realIndex : swiper.activeIndex;
                    console.log('Swiper slide change:', {
                        realIndex: swiper.realIndex,
                        activeIndex: swiper.activeIndex,
                        newIndex,
                        totalPages,
                        loop
                    });
                    setCurrentSlide(newIndex);
                    if (onSlideChange) {
                        onSlideChange(newIndex);
                    }
                }}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    // 초기 슬라이드 인덱스 설정
                    const initialIndex = loop ? swiper.realIndex : swiper.activeIndex;
                    console.log('Swiper initialized:', {
                        realIndex: swiper.realIndex,
                        activeIndex: swiper.activeIndex,
                        initialIndex,
                        totalPages,
                        loop
                    });
                    setCurrentSlide(initialIndex);
                }}
                className="w-full h-full"
                style={{ height: '100%' }}
            >
                {renderSlides()}
            </SwiperCore>

            {/* 기존 스타일의 네비게이션 버튼 오버라이드 */}
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

            {/* 기존 스타일의 페이지네이션 도트 */}
            {showPagination && totalPages > 1 && !renderExternalPagination && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentSlide
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
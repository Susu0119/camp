import React, { useState, useEffect, useRef, useCallback } from 'react';

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

    // 드래그 관련 상태
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [hasDragged, setHasDragged] = useState(false);
    const dragDataRef = useRef({
        isDragging: false,
        startX: 0,
        currentX: 0,
        offset: 0,
        hasMoved: false
    });

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

    // 실제 페이지 수 계산 - 더 간단하고 정확하게
    const totalPages = currentSlidesPerColumn > 1
        ? Math.ceil(totalSlides / slidesPerPage)  // 그리드 모드
        : Math.max(1, totalSlides - currentSlidesPerView + 1); // 일반 모드
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
    const goToNext = useCallback(() => {
        if (isTransitioning) return;

        setIsTransitioning(true);

        let nextSlide;
        if (loop) {
            nextSlide = (currentSlide + 1) % totalPages;
        } else {
            nextSlide = Math.min(currentSlide + 1, maxSlideIndex);
        }

        setCurrentSlide(nextSlide);

        setTimeout(() => {
            setIsTransitioning(false);
        }, 250);
    }, [isTransitioning, loop, totalPages, maxSlideIndex, currentSlide]);

    // 이전 슬라이드로 이동
    const goToPrev = useCallback(() => {
        if (isTransitioning) return;

        setIsTransitioning(true);

        let prevSlide;
        if (loop) {
            prevSlide = (currentSlide - 1 + totalPages) % totalPages;
        } else {
            prevSlide = Math.max(currentSlide - 1, 0);
        }

        setCurrentSlide(prevSlide);

        setTimeout(() => {
            setIsTransitioning(false);
        }, 250);
    }, [isTransitioning, loop, totalPages, currentSlide]);

    // 특정 슬라이드로 이동
    const goToSlide = useCallback((index) => {
        if (isTransitioning || index === currentSlide) return;

        setIsTransitioning(true);
        setCurrentSlide(Math.min(index, maxSlideIndex));
        setTimeout(() => setIsTransitioning(false), 250);
    }, [isTransitioning, currentSlide, maxSlideIndex]);

    // 드래그 시작 (마우스/터치)
    const handleDragStart = useCallback((clientX) => {
        if (isTransitioning) return;

        dragDataRef.current = {
            isDragging: true,
            startX: clientX,
            currentX: clientX,
            offset: 0,
            hasMoved: false
        };

        setIsDragging(true);
        setDragOffset(0);
        setHasDragged(false);

        // 자동재생 중지
        if (autoplay) stopAutoplay();
    }, [isTransitioning, autoplay]);

    // 드래그 중 (마우스/터치)
    const handleDragMove = useCallback((clientX) => {
        if (!dragDataRef.current.isDragging) return;

        const diff = clientX - dragDataRef.current.startX;

        // 최소 1px 이상 움직여야 드래그로 인식
        if (Math.abs(diff) >= 1) {
            dragDataRef.current.hasMoved = true;
            setHasDragged(true);
        }

        dragDataRef.current.currentX = clientX;
        dragDataRef.current.offset = diff;

        setDragOffset(diff);
    }, []);

    // 드래그 종료 (마우스/터치)
    const handleDragEnd = useCallback(() => {
        if (!dragDataRef.current.isDragging) return;

        const dragDistance = dragDataRef.current.currentX - dragDataRef.current.startX;
        const threshold = Math.max(20, swiperRef.current?.offsetWidth * 0.05);

        // 상태 초기화
        dragDataRef.current.isDragging = false;
        setIsDragging(false);
        setDragOffset(0);

        // 실제로 드래그했고 임계값을 넘었을 때만 슬라이드 변경
        if (dragDataRef.current.hasMoved && Math.abs(dragDistance) > threshold) {
            if (dragDistance > 0 && (loop || currentSlide > 0)) {
                // 오른쪽으로 드래그 - 이전 슬라이드
                goToPrev();
            } else if (dragDistance < 0 && (loop || currentSlide < maxSlideIndex)) {
                // 왼쪽으로 드래그 - 다음 슬라이드
                goToNext();
            }
        }

        // 드래그 상태를 더 짧게 유지
        if (dragDataRef.current.hasMoved) {
            setTimeout(() => {
                setHasDragged(false);
            }, 150);
        } else {
            setHasDragged(false);
        }

        // 자동재생 재시작
        if (autoplay) {
            setTimeout(() => {
                startAutoplay();
            }, 250);
        }
    }, [autoplay, goToPrev, goToNext, currentSlide, maxSlideIndex, loop]);

    // 클릭 이벤트 방지 핸들러 - 이벤트 캡처링 단계에서 차단
    const handleClick = useCallback((e) => {
        if (hasDragged || dragDataRef.current.hasMoved) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        }
    }, [hasDragged]);

    // 마우스 이벤트 핸들러
    const handleMouseDown = useCallback((e) => {
        // 우클릭은 무시
        if (e.button !== 0) return;

        e.preventDefault();
        handleDragStart(e.clientX);
    }, [handleDragStart]);

    const handleMouseMove = useCallback((e) => {
        e.preventDefault();
        handleDragMove(e.clientX);
    }, [handleDragMove]);

    const handleMouseUp = useCallback((e) => {
        e.preventDefault();
        handleDragEnd();
    }, [handleDragEnd]);

    const handleMouseLeave = useCallback(() => {
        if (dragDataRef.current.isDragging) {
            handleDragEnd();
        }
    }, [handleDragEnd]);

    // 터치 이벤트 핸들러
    const handleTouchStart = useCallback((e) => {
        handleDragStart(e.touches[0].clientX);
    }, [handleDragStart]);

    const handleTouchMove = useCallback((e) => {
        if (!dragDataRef.current.isDragging) return;
        e.preventDefault(); // 스크롤 방지
        handleDragMove(e.touches[0].clientX);
    }, [handleDragMove]);

    const handleTouchEnd = useCallback((e) => {
        if (!dragDataRef.current.isDragging) return;
        e.preventDefault();
        handleDragEnd();
    }, [handleDragEnd]);

    // 전역 마우스 이벤트 리스너 추가/제거
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove, { passive: false });
            document.addEventListener('mouseup', handleMouseUp, { passive: false });

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

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

    // 마우스 호버 시 자동재생 일시정지 (드래그 중이 아닐 때만)
    const handleMouseEnter = () => {
        if (autoplay && !isDragging) stopAutoplay();
    };

    const handleMouseLeaveContainer = () => {
        if (autoplay && !isDragging) startAutoplay();
        if (isDragging) handleMouseLeave();
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

    // Transform 계산 - 드래그 오프셋 포함
    const getTransformValue = () => {
        let baseTransform;

        if (currentSlidesPerColumn > 1) {
            // 그리드 모드: 전체 페이지 단위로 이동
            baseTransform = -currentSlide * 100;
        } else {
            // 일반 모드: slidesPerPage 단위로 이동
            baseTransform = -currentSlide * (100 / currentSlidesPerView);
        }

        // 드래그 중일 때 오프셋 추가
        if (isDragging && swiperRef.current) {
            const dragPercent = (dragOffset / swiperRef.current.offsetWidth) * 100;
            baseTransform += dragPercent;
        }

        return `translateX(${baseTransform}%)`;
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
                        paddingRight: `${currentSpaceBetween / 2}px`,
                        paddingLeft: `${currentSpaceBetween / 2}px`
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
            className={`relative w-full overflow-hidden select-none ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeaveContainer}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClickCapture={handleClick}
        >
            {/* 슬라이드 컨테이너 */}
            <div
                className={`flex ${isDragging ? '' : 'transition-transform duration-200 ease-out'}`}
                style={{
                    transform: getTransformValue(),
                    pointerEvents: isDragging ? 'none' : 'auto'
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
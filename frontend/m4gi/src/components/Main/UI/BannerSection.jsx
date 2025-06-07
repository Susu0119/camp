import React, { useState, useCallback, useEffect } from 'react';
import Swiper from '../../Common/Swiper';

// CSS 애니메이션 추가
const addBannerAnimations = () => {
    if (!document.getElementById('banner-animations')) {
        const style = document.createElement('style');
        style.id = 'banner-animations';
        style.textContent = `
            @keyframes rocketBounce {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-20px);
                }
            }
            @keyframes wave {
                0% {
                    transform: translateX(-100%);
                }
                100% {
                    transform: translateX(100%);
                }
            }
            @keyframes float {
                0%, 100% {
                    transform: translateY(0) rotate(0deg);
                }
                50% {
                    transform: translateY(-15px) rotate(5deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
};

// 캠피아 이벤트 배너 1 컴포넌트
const CampiaEventBanner = ({ className = "" }) => {
    return (
        <div className={`relative overflow-hidden cursor-pointer transition-all duration-500 ${className}`}
            style={{
                background: 'radial-gradient(circle at center, #00ff88, #00cc6a, #009951)',
                boxShadow: '0 20px 60px rgba(0, 255, 136, 0.4)',
                transform: 'perspective(1000px) rotateX(5deg)',
                boxSizing: 'border-box',
                width: '594px',
                height: '321.07px'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 30px 80px rgba(0, 255, 136, 0.6)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(5deg)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 255, 136, 0.4)';
            }}>

            {/* 회전 효과 - 컨테이너 내부에 제한 */}
            <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: '50px' }}>
                <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] animate-spin"
                    style={{
                        background: 'conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                        animationDuration: '8s'
                    }}>
                </div>
            </div>

            {/* 컨텐츠 */}
            <div className="relative z-10 h-full flex items-center px-12 md:px-16 text-white">
                <div className="flex-1 min-w-0">
                    <div className="inline-block mb-2 px-3 py-1.5 rounded-2xl font-bold text-sm"
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: '2px solid #00ff88',
                            boxShadow: '0 0 15px rgba(0, 255, 136, 0.5)'
                        }}>
                        🌟 GRAND OPEN
                    </div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black leading-tight m-0"
                        style={{
                            textShadow: '0 0 15px rgba(0, 255, 136, 0.8)'
                        }}>
                        캠피아<br />그랜드 오픈!
                    </h1>
                    <p className="text-sm md:text-base mt-2 mb-0">자연과 하나되는 특별한 캠핑 여행</p>
                </div>

                <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center text-lg md:text-xl font-black text-[#009951] animate-pulse flex-shrink-0"
                    style={{
                        background: 'radial-gradient(circle, #ffffff, #00ff88)',
                        boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)',
                        animationDuration: '2s'
                    }}>
                    <div className="text-center">
                        <div>30%</div>
                        <div className="text-xs md:text-sm">OFF</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 캠피아 이벤트 배너 2 컴포넌트 - 사선 분할 스타일
const CampiaEventBanner2 = ({ className = "" }) => {
    return (
        <div className={`relative overflow-hidden cursor-pointer transition-all duration-400 ${className}`}
            style={{
                background: 'linear-gradient(45deg, #ff6b35 0%, #ff8e53 50%, #ffa726 100%)',
                boxShadow: '0 15px 40px rgba(255, 107, 53, 0.4)',
                clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)',
                boxSizing: 'border-box',
                width: '594px',
                height: '321.07px'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.clipPath = 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)';
                e.currentTarget.style.boxShadow = '0 25px 60px rgba(255, 107, 53, 0.6)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.clipPath = 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(255, 107, 53, 0.4)';
            }}>

            {/* 사선 효과 */}
            <div className="absolute top-0 right-0 w-[200px] h-full"
                style={{
                    background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1))',
                    transform: 'skewX(-20deg)'
                }}>
            </div>

            {/* 컨텐츠 */}
            <div className="relative z-10 h-full grid grid-cols-3 items-center px-6 md:px-8 text-white">
                <div className="col-span-2 min-w-0">
                    <div className="inline-block mb-2 px-3 py-1.5 rounded-2xl font-bold text-sm"
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)'
                        }}>
                        🚀 NEW LAUNCH
                    </div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black leading-tight m-0"
                        style={{
                            transform: 'skewX(-10deg)',
                            textShadow: '3px 3px 0px rgba(0, 0, 0, 0.3)'
                        }}>
                        캠피아<br />신규 런칭!
                    </h1>
                    <p className="text-sm md:text-base mt-2 mb-0">스마트한 캠핑 예약의 혁신</p>
                </div>

                <div className="text-center">
                    <div className="text-4xl md:text-5xl lg:text-6xl"
                        style={{
                            filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))',
                            animation: 'rocketBounce 2s ease-in-out infinite'
                        }}>
                        🚀
                    </div>

                </div>
            </div>
        </div>
    );
};

// 캠피아 이벤트 배너 3 컴포넌트 - 딥 블루
const CampiaEventBanner3 = ({ className = "" }) => {
    return (
        <div className={`relative overflow-hidden cursor-pointer transition-all duration-400 ${className}`}
            style={{
                background: 'linear-gradient(135deg, #0d47a1, #1976d2, #42a5f5, #81d4fa)',
                boxShadow: '0 25px 50px rgba(13, 71, 161, 0.4)',
                boxSizing: 'border-box',
                width: '594px',
                height: '321.07px'
            }}>

            {/* 웨이브 효과 */}
            <div className="absolute top-0 left-0 w-full h-full"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                    animation: 'wave 4s ease-in-out infinite',
                    transform: 'translateX(-100%)'
                }}>
            </div>

            {/* 컨텐츠 */}
            <div className="relative z-10 h-full flex items-center justify-between px-6 md:px-8 text-white">
                <div className="flex-1 min-w-0">
                    <div className="inline-block mb-2 px-3 py-1.5 rounded-2xl font-bold text-sm"
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)'
                        }}>
                        👑 PREMIUM OPEN
                    </div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black leading-tight m-0"
                        style={{
                            textShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
                        }}>
                        캠피아<br />프리미엄 오픈!
                    </h1>
                    <p className="text-sm md:text-base mt-2 mb-0">최고급 캠핑 경험을 선사합니다</p>
                </div>

                <div className="text-center">
                    <div className="text-4xl md:text-5xl lg:text-6xl"
                        style={{
                            color: '#ffd700',
                            filter: 'drop-shadow(0 5px 15px rgba(255, 215, 0, 0.5))',
                            animation: 'float 3s ease-in-out infinite'
                        }}>
                        👑
                    </div>
                    <div className="text-sm md:text-base font-bold mt-2" style={{ color: '#ffd700' }}>VIP</div>
                </div>
            </div>
        </div>
    );
};

const BannerSection = ({ banners = [] }) => {
    const [paginationData, setPaginationData] = useState({
        totalSlides: 0,
        currentSlide: 0,
        goToSlide: () => { },
        isTransitioning: false,

    });

    // 컴포넌트 마운트 시 애니메이션 추가
    useEffect(() => {
        addBannerAnimations();
    }, []);

    // useCallback으로 함수 메모이제이션
    const renderExternalPagination = useCallback((data) => {
        setPaginationData(prevData => {
            // 값이 실제로 변경된 경우에만 업데이트
            if (JSON.stringify(prevData) !== JSON.stringify(data)) {
                return data;
            }
            return prevData;
        });
    }, []);

    // banners가 없거나 비어있을 때 기본 배너 제공
    const defaultBanners = [
        { id: 1, type: 'component', component: <CampiaEventBanner />, alt: "캠피아 그랜드 오픈 이벤트" },
        { id: 2, type: 'component', component: <CampiaEventBanner2 />, alt: "캠피아 신규 런칭 이벤트" },
        { id: 3, type: 'component', component: <CampiaEventBanner3 />, alt: "캠피아 프리미엄 오픈 이벤트" },
        { id: 4, image: "https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/9fe4ed7e359d2eafce08baace6ad0df8cc370c71?placeholderIfAbsent=true", alt: "Event banner 3" },
        { id: 5, image: "https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/9fe4ed7e359d2eafce08baace6ad0df8cc370c71?placeholderIfAbsent=true", alt: "Event banner 5" },
    ];

    const displayBanners = banners.length > 0 ? banners : defaultBanners;

    return (
        <section className="flex flex-col items-center mt-5">
            <Swiper
                showPagination={false}
                renderExternalPagination={renderExternalPagination}
                autoplay={true}
                autoplayDelay={5000}
                slidesPerView={2}
                slidesToScroll={1}
                spaceBetween={6}
                className="w-full max-w-[1200px]"
            >
                {displayBanners.map((banner) => (
                    <div
                        key={banner.id}
                        className="flex overflow-hidden flex-col justify-center rounded-lg min-h-[300px]"
                    >
                        {banner.type === 'component' ? (
                            React.cloneElement(banner.component, {
                                className: "object-contain w-full h-full aspect-[1.85] rounded-lg"
                            })
                        ) : (
                            <img
                                src={banner.image}
                                alt={banner.alt}
                                className="object-contain w-full h-full aspect-[1.85] rounded-lg"
                            />
                        )}
                    </div>
                ))}
            </Swiper>

            {/* 외부 페이지네이션 */}
            {paginationData.totalSlides > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                    {Array.from({ length: paginationData.totalSlides }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => paginationData.goToSlide(index)}
                            disabled={paginationData.isTransitioning}
                            className={`w-3 h-3 rounded-full transition-all duration-200 ${index === paginationData.currentSlide
                                ? 'bg-cpurple w-8'
                                : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default BannerSection;
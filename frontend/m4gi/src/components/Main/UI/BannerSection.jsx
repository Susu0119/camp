import React, { useState, useCallback } from 'react';
import Swiper from '../../Common/Swiper';

const BannerSection = ({ banners = [] }) => {
    const [paginationData, setPaginationData] = useState({
        totalSlides: 0,
        currentSlide: 0,
        goToSlide: () => {},
        isTransitioning: false,
        
    });

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
        { id: 1, image: "https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/9fe4ed7e359d2eafce08baace6ad0df8cc370c71?placeholderIfAbsent=true", alt: "Event banner 1" },
        { id: 2, image: "https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/9fe4ed7e359d2eafce08baace6ad0df8cc370c71?placeholderIfAbsent=true", alt: "Event banner 2" },
        { id: 3, image: "https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/9fe4ed7e359d2eafce08baace6ad0df8cc370c71?placeholderIfAbsent=true", alt: "Event banner 3" },
        { id: 4, image: "https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/9fe4ed7e359d2eafce08baace6ad0df8cc370c71?placeholderIfAbsent=true", alt: "Event banner 4" },
        { id: 5, image: "https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/9fe4ed7e359d2eafce08baace6ad0df8cc370c71?placeholderIfAbsent=true", alt: "Event banner 4" },
    ];

    const displayBanners = banners.length > 0 ? banners : defaultBanners;

    return (
        <section className="flex flex-col items-center mt-5">
            <Swiper 
                showPagination={false}
                renderExternalPagination={renderExternalPagination}
                autoplay={true}
                autoplayDelay={4000}
                slidesPerView={2}
                spaceBetween={6}
                className="w-full max-w-[1200px]"
            >
                {displayBanners.map((banner) => (
                    <div
                        key={banner.id}
                        className="flex overflow-hidden flex-col justify-center rounded-lg min-h-[300px]"
                    >
                        <img
                            src={banner.image}
                            alt={banner.alt}
                            className="object-contain w-full h-full aspect-[1.85] rounded-lg"
                        />
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
                            className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                index === paginationData.currentSlide
                                    ? 'bg-blue-600 w-8'
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
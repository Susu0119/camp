import React, { useState, useCallback } from 'react';
import CampingSiteCard from "./Card";
import Swiper from "../../Common/Swiper";

export default function CampingSiteSection({ title, sites, variant = 'grid', backgroundColor = 'transparent' }) {
    const [paginationData, setPaginationData] = useState({
        totalSlides: 0,
        currentSlide: 0,
        goToSlide: () => { },
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
    return (
        <>
            {variant === 'grid' && (
                <section className="flex flex-col mt-5 w-full">
                    <h2 className="text-xl font-bold leading-snug ml-32 text-slate-950">{title}</h2>
                    <Swiper
                        autoplay={false}
                        autoplayDelay={4000}
                        slidesPerView={1}
                        slidesPerColumn={1}
                        slidesToScroll={1}
                        spaceBetween={0}
                        className="w-full"
                        showNavigation={true}
                        showPagination={false}
                        renderExternalPagination={renderExternalPagination}
                    >
                        {/* 6개씩 나누어서 각 페이지에 2x3 그리드로 표시 */}
                        {Array.from({ length: Math.ceil(sites.length / 6) }, (_, pageIndex) => (
                            <div key={pageIndex} className={`grid grid-cols-3 gap-5 items-start p-2.5 mt-5 w-full ${backgroundColor}`}>
                                {sites.slice(pageIndex * 6, (pageIndex + 1) * 6).map((site, index) => {
                                    const actualIndex = pageIndex * 6 + index;
                                    let alignmentClass = 'justify-center'; // 기본값은 중앙 정렬 (중앙 컬럼)
                                    if (index % 3 === 0) { // 첫 번째 컬럼 (0, 3, 6, ...)
                                        alignmentClass = 'justify-end'; // 우측 정렬
                                    } else if (index % 3 === 2) { // 세 번째 컬럼 (2, 5, 8, ...)
                                        alignmentClass = 'justify-start'; // 좌측 정렬
                                    }

                                    return (
                                        // 각 카드를 div로 감싸고 flex와 정렬 클래스 적용
                                        <div key={actualIndex} className={`flex ${alignmentClass} w-full`}>
                                            <CampingSiteCard site={site} />
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </Swiper>

                    {/* 외부 페이지네이션 - 기존 페이지네이션 자리에 위치 */}
                    {paginationData.totalSlides > 1 && (
                        <div className="flex gap-2.5 items-start mt-5 justify-center">
                            {Array.from({ length: paginationData.totalSlides }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => paginationData.goToSlide(index)}
                                    disabled={paginationData.isTransitioning}
                                    className={`w-3 h-3 rounded-full transition-all duration-200 ${index === paginationData.currentSlide
                                        ? 'bg-fuchsia-700 w-6'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </section>
            )}

            {variant === 'horizontal' && (
                <section className="flex flex-col mt-5 w-[1440px]">
                    <h2 className="text-xl font-bold leading-snug text-slate-950">{title}</h2>
                    <Swiper
                        autoplay={false}
                        autoplayDelay={4000}
                        slidesPerView={4}
                        slidesPerColumn={1}
                        slidesToScroll={1}
                        spaceBetween={20}
                        className="w-full"
                        showNavigation={true}
                        showPagination={false}
                        renderExternalPagination={renderExternalPagination}
                    >
                        {sites.map((site, index) => (
                            <div key={index} className="flex overflow-visible flex-wrap gap-4 items-center">
                                <CampingSiteCard site={site} variant='small' />
                            </div>
                        ))}
                    </Swiper>

                    {/* 외부 페이지네이션 */}
                    {paginationData.totalSlides > 1 && (
                        <div className="flex gap-2.5 items-start mt-5 justify-center">
                            {Array.from({ length: paginationData.totalSlides }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => paginationData.goToSlide(index)}
                                    disabled={paginationData.isTransitioning}
                                    className={`w-3 h-3 rounded-full transition-all duration-200 ${index === paginationData.currentSlide
                                        ? 'bg-fuchsia-700 w-6'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </section>
            )}

            {variant === 'new' && (
                <section className="flex flex-col mt-5 w-[1440px]">
                    <h2 className="text-xl font-bold leading-snug text-slate-950">{title}</h2>
                    <Swiper
                        autoplay={false}
                        autoplayDelay={4000}
                        slidesPerView={4}
                        slidesPerColumn={1}
                        slidesToScroll={1}
                        spaceBetween={20}
                        className="w-full"
                        showNavigation={true}
                        showPagination={false}
                        renderExternalPagination={renderExternalPagination}
                    >
                        {sites.map((site, index) => (
                            <div key={index} className="flex overflow-visible flex-wrap gap-4 items-center">
                                <CampingSiteCard key={index} site={{ ...site, isNew: true }} variant='small' />
                            </div>
                        ))}
                    </Swiper>

                    {/* 외부 페이지네이션 */}
                    {paginationData.totalSlides > 1 && (
                        <div className="flex gap-2.5 items-start mt-5 justify-center">
                            {Array.from({ length: paginationData.totalSlides }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => paginationData.goToSlide(index)}
                                    disabled={paginationData.isTransitioning}
                                    className={`w-3 h-3 rounded-full transition-all duration-200 ${index === paginationData.currentSlide
                                        ? 'bg-fuchsia-700 w-6'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </section>
            )}


        </>
    );
};

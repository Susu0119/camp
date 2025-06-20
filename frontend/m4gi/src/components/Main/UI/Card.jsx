import { Badge } from "../../Common/Badge";
import StarRating from "../../Common/StarRating";
import { useNavigate } from "react-router-dom";
import { translateType } from "../../../utils/Translate";

// 스켈레톤 카드 컴포넌트
function SkeletonCard({ variant = '' }) {
    if (variant === 'small') {
        return (
            <article className="flex overflow-hidden flex-col justify-center p-4 bg-white rounded-xl w-[340px] animate-pulse">
                <div className="w-full relative">
                    <div className="relative w-full" style={{ paddingTop: '75%' }}>
                        <div className="absolute top-0 left-0 w-full h-full bg-gray-300 rounded-xl"></div>
                    </div>
                    <div className="flex gap-auto justify-between items-center px-2.5 pb-2.5 mt-4 w-full">
                        <div className="self-stretch my-auto w-[199px]">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                        </div>
                        <div className="self-stretch text-right my-auto w-[120px]">
                            <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded w-3/4 ml-auto"></div>
                        </div>
                    </div>
                </div>
            </article>
        );
    }

    // 기본 variant (grid용)
    return (
        <article className="flex overflow-hidden flex-col justify-center p-4 bg-white rounded-xl w-[460px] animate-pulse">
            <div className="w-full relative">
                <div className="relative w-full" style={{ paddingTop: '75%' }}>
                    <div className="absolute top-0 left-0 w-full h-full bg-gray-300 rounded-xl"></div>
                </div>
                <div className="flex gap-auto justify-between items-center px-2.5 pb-2.5 mt-4 w-full">
                    <div className="self-stretch my-auto w-[199px]">
                        <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                    </div>
                    <div className="self-stretch text-right my-auto w-[120px]">
                        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-3/4 ml-auto"></div>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function Card({ site, variant = '', startDate, endDate, people, onReservationClick, skeleton = false }) {
    const navigate = useNavigate();

    // 스켈레톤 모드인 경우 스켈레톤 UI 렌더링
    if (skeleton) {
        return <SkeletonCard variant={variant} />;
    }

    const { id, name, location, type, score, price, remainingSpots, image, isNew, isWishlisted, isPeakSeason } = site;

    // remainingSpots가 null이거나 undefined인 경우 0으로 처리
    const displayRemainingSpots = remainingSpots ?? 0;

    // 캠핑장 타입 한글 변환
    const translatedType = translateType(type);

    // 캠핑장 카드 클릭 시, 해당 캠핑장으로 이동
    const handleCardClick = () => {
        navigate(`/detail/${id}`); // id = 캠핑장 아이디 
    }

    // 캠핑장 상세 페이지 내 "구역 카드 UI(variant === long)"의 예약하기 버튼 클릭 시
    const handleZoneClick = () => {
        if (variant === "long" && displayRemainingSpots > 0) {
            if (onReservationClick) {
                onReservationClick();
            }
        }
    };

    if (variant === 'small') {
        return (
            <article className="flex overflow-hidden flex-col justify-center p-4 bg-white rounded-xl w-[340px] cursor-pointer" onClick={handleCardClick}>
                <div className="w-full relative">
                    <div className="relative w-full" style={{ paddingTop: '75%' }}>
                        {image ? (
                            <img
                                src={image}
                                alt={name}
                                className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
                            />
                        ) : (
                            <div className="absolute top-0 left-0 w-full h-full bg-gray-200 rounded-xl flex items-center justify-center no-image">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    {isNew && (
                        <Badge className="absolute top-1.5 left-1.5">NEW</Badge>
                    )}
                    <div className="flex gap-auto justify-between items-center px-2.5 pb-2.5 mt-4 w-full">
                        <div className="self-stretch my-auto w-[199px]">
                            <h3 className="text-base font-bold text-neutral-900 whitespace-nowrap overflow-hidden text-ellipsis">{name}</h3>
                            {location && type && (
                                <div className="flex gap-3.5 mt-2.5 w-full text-xs rounded-none">
                                    <p className="text-neutral-900 whitespace-nowrap">{location}</p>
                                    <p className="text-neutral-400 whitespace-nowrap">{translatedType}</p>
                                </div>
                            )}
                            <div className="flex flex-row relative top-2 right-0.5">
                                <StarRating name="rating" rating={score} readOnly={true} size="small" />
                                <div className="ml-2 py-0">
                                    <Badge variant="card" className="text-xs">{score}</Badge>
                                </div>
                            </div>
                        </div>
                        <div className="self-stretch text-right w-[120px]">
                            <div className="flex overflow-hidden flex-col justify-center items-end px-0.5 w-full">
                                {isWishlisted === 1 ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-fuchsia-700">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-fuchsia-700">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                    </svg>
                                )}
                            </div>
                            {price !== null && price !== undefined && (
                                <div className="flex flex-col mt-2">
                                    <p className="text-base font-bold text-fuchsia-700">
                                        {typeof price === 'number'
                                            ? `₩${price.toLocaleString()} ~`
                                            : price.startsWith('₩') ? price : `₩${price} ~`}
                                    </p>
                                    {startDate && endDate && (
                                        <p className="mt-1.5 text-xs text-right text-neutral-400">
                                            남은 자리 : {displayRemainingSpots}개
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </article>
        );
    }

    if (variant === 'long') {
        return (
            <article className="p-2.5 w-full bg-white rounded-xl h-[220px]">
                <div className="flex flex-wrap justify-between w-full">
                    <div className="flex flex-wrap gap-5 h-full text-lg font-bold min-w-60 text-neutral-900 max-md:max-w-full">
                        {image ? (
                            <img
                                src={image}
                                className="object-fill my-auto rounded-xl aspect-[1.9] min-w-60 w-[380px]"
                                alt={name}
                            />
                        ) : (
                            <div className="my-auto rounded-xl aspect-[1.9] min-w-60 w-[380px] bg-gray-200 flex items-center justify-center no-image">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                        <h3 className="flex-1 shrink gap-2.5 pt-5 h-full basis-0 w-[300px]">
                            {name}
                        </h3>
                    </div>
                    <div className="flex flex-col flex-1 shrink pl-5 basis-0 min-w-60 max-md:max-w-full"> {/* 부모 요소 */}
                        {/* 이 위쪽에 다른 자식 요소가 있다면 그 요소들이 먼저 배치됩니다. */}

                        {/* 아래로 보낼 요소: flex-1 제거, mt-auto 유지 */}
                        <div className="flex flex-col items-end w-full max-md:max-w-full mt-auto">
                            <div className="flex flex-col items-center">
                                <div className=" w-[160px]">
                                    {isPeakSeason && (
                                        <div className="flex justify-end mb-2">
                                            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                                                성수기
                                            </span>
                                        </div>
                                    )}
                                    <div className={`flex items-center w-full text-base justify-end ${isPeakSeason ? 'bg-red-50 p-2 rounded-md border border-red-200' : ''}`}>
                                        <span className={`self-stretch my-auto font-bold ${isPeakSeason ? 'text-red-600' : 'text-fuchsia-700'}`}>
                                            {typeof price === 'number'
                                                ? `${price.toLocaleString()}`
                                                : `${Number(price).toLocaleString()}`}
                                        </span>
                                        <span className="self-stretch my-auto text-neutral-900">
                                            원 / 1박
                                        </span>
                                    </div>
                                    {startDate && endDate && (
                                        <p className="mt-2.5 text-sm text-right text-neutral-900">
                                            남은 자리 : {displayRemainingSpots} 개
                                        </p>
                                    )}
                                </div>
                                {displayRemainingSpots > 0 ? (
                                    <button className="overflow-hidden py-2.5 pr-10 pl-10 mt-5 w-full text-base font-bold text-white bg-cpurple rounded-lg min-h-10" onClick={handleZoneClick}>
                                        예약하기
                                    </button>
                                ) : (
                                    <button className="cursor-not-allowed overflow-hidden py-2.5 pr-10 pl-10 mt-5 w-full text-base font-bold text-white bg-cpurple opacity-50 rounded-lg min-h-10" disabled>
                                        예약마감
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        );
    }

    return (
        <article className="flex overflow-hidden flex-col justify-center p-4 bg-white rounded-xl w-[460px] cursor-pointer" onClick={handleCardClick}>
            <div className="w-full relative">
                <div className="relative w-full" style={{ paddingTop: '75%' }}>
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            className="absolute top-0 left-0 w-full h-full rounded-xl transform-gpu will-change-transform"
                        />
                    ) : (
                        <div className="absolute top-0 left-0 w-full h-full bg-gray-200 rounded-xl flex items-center justify-center no-image">
                            No Image
                        </div>
                    )}
                </div>
                {isNew && (
                    <Badge className="absolute top-2 left-2">NEW</Badge>
                )}
                <div className="flex gap-auto justify-between items-center px-2.5 pb-2.5 mt-4 w-full">
                    <div className="self-stretch my-auto w-[199px]">
                        <h3 className="text-lg font-bold text-neutral-900 whitespace-nowrap overflow-hidden text-ellipsis">{name}</h3>
                        {location && type && (
                            <div className="flex gap-3.5 mt-2.5 w-full text-xs rounded-none">
                                <p className="text-neutral-900 whitespace-nowrap">{location}</p>
                                <p className="text-neutral-400 whitespace-nowrap">{translatedType}</p>
                            </div>
                        )}
                        <div className="flex flex-row relative top-2 right-0.5">
                            <StarRating name="rating" rating={score} readOnly={true} size="small" />
                            <div className="ml-2 py-0">
                                <Badge variant="card" className="text-xs">{score}</Badge>
                            </div>
                        </div>
                    </div>
                    <div className="self-stretch text-right w-[120px]">
                        <div className="flex overflow-hidden flex-col justify-center items-end px-0.5 w-full">
                            {isWishlisted === 1 ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-fuchsia-700">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-fuchsia-700">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                            )}
                        </div>
                        {price !== null && price !== undefined && (
                            <div className="flex flex-col mt-3">
                                <p className="text-base font-bold text-fuchsia-700">
                                    {typeof price === 'number'
                                        ? `₩${price.toLocaleString()} ~`
                                        : price.startsWith('₩') ? price : `₩${price} ~`}
                                </p>
                                {startDate && endDate && (
                                    <p className="mt-1.5 text-xs text-right text-neutral-400">
                                        남은 자리 : {displayRemainingSpots}개
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
import { Badge } from "../../Common/Badge";
import StarRating from "../../Common/StarRating";
import { useNavigate } from "react-router-dom";

export default function Card({ site, variant = '' }) {
    const navigate = useNavigate();
    const { id, name, location, type, score, price, remainingSpots, image, isNew, isWishlisted } = site;
    
    // 캠핑장 카드 클릭 시, 해당 캠핑장으로 이동
    const handleCardClick = () => {
        navigate(`/detail/${id}`); // id = 캠핑장 아이디 
    }

    if (variant === 'small') {
        return (
            <article className="flex overflow-hidden flex-col justify-center p-4 bg-white rounded-xl w-[340px] cursor-pointer" onClick={handleCardClick}>
                <div className="w-full relative">
                    <div className="relative w-full" style={{ paddingTop: '75%' }}>
                        <img
                            src={image}
                            alt={name}
                            className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
                        />
                    </div>
                    {isNew && (
                        <Badge className="absolute top-1.5 left-1.5">NEW</Badge>

                    )}
                    <div className="flex gap-auto justify-between items-center px-2.5 pb-2.5 mt-4 w-full">
                        <div className="self-stretch my-auto w-[199px]">
                            <h3 className="text-base font-bold text-neutral-900 whitespace-nowrap overflow-hidden text-ellipsis">{name}</h3>
                            {location && type && (
                                <div className="flex gap-3.5 mt-2.5 w-full text-xs rounded-none">
                                    <p className="text-neutral-900">{location}</p>
                                    <p className="text-neutral-400">{type}</p>
                                </div>
                            )}
                            <div className="relative top-2 right-0.5">
                                <StarRating name="rating" rating={score} readOnly='true' size="small" />
                            </div>
                        </div>
                        <div className="self-stretch text-right my-auto w-[120px]">
                            <div className="flex overflow-hidden flex-col justify-center items-end px-0.5 py-1 w-full">
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
                            {price !== null && price !== undefined && remainingSpots !== undefined && ( // (설명 추후 삭제) price가 0원일때도 가격이 출력되도록 수정 원래 코드는 price && remainingSpots !== undefined &&
                            <div className="flex flex-col mt-2.5">
                                <p className="text-base font-bold text-fuchsia-700">
                                    {typeof price === 'number'
                                        ? `₩${price.toLocaleString()} ~`
                                        : price.startsWith('₩') ? price : `₩${price} ~`}
                                </p>
                                <p className="mt-1.5 text-xs text-right text-neutral-400">
                                    남은 자리 : {remainingSpots}개
                                </p>
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
                        <img
                            src={image}
                            className="object-fill my-auto rounded-xl aspect-[1.9] min-w-60 w-[380px]"
                            alt={name}
                        />
                        <h3 className="flex-1 shrink gap-2.5 pt-5 h-full basis-0 w-[140px]">
                            {name}
                        </h3>
                    </div>
                    <div className="flex flex-col flex-1 shrink pl-5 basis-0 min-w-60 max-md:max-w-full"> {/* 부모 요소 */}
                        {/* 이 위쪽에 다른 자식 요소가 있다면 그 요소들이 먼저 배치됩니다. */}

                        {/* 아래로 보낼 요소: flex-1 제거, mt-auto 유지 */}
                        <div className="flex flex-col items-end w-full max-md:max-w-full mt-auto">
                            <div className="flex flex-col items-center">
                                <div className=" w-[160px]">
                                    <div className="flex items-center w-full text-base justify-end">
                                        <span className="self-stretch my-auto font-bold text-fuchsia-700">
                                        {typeof price === 'number'
                                        ? `${price.toLocaleString()}`
                                        : `${Number(price).toLocaleString()}`}
                                        </span>
                                        <span className="self-stretch my-auto text-neutral-900">
                                            원 / 1박
                                        </span>
                                    </div>
                                    <p className="mt-2.5 text-sm text-right text-neutral-900">
                                        남은 자리 : {remainingSpots} 개
                                    </p>
                                </div>
                                {remainingSpots > 0 ? (
                                    <button className="overflow-hidden py-2.5 pr-10 pl-10 mt-5 w-full text-base font-bold text-white bg-fuchsia-700 rounded-lg min-h-10">
                                        예약 하기
                                    </button>
                                ) : (
                                    <button className="flex gap-2.5 justify-center items-center px-2.5 py-2 mt-5 w-full text-base font-bold text-center bg-purple-200 rounded-xl min-h-10 text-neutral-900">
                                        <img
                                            src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/cea3b0baa49eb60079623b2735cabd9322aa6cd2?placeholderIfAbsent=true"
                                            className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
                                            alt="알림"
                                        />
                                        <span className="self-stretch my-auto">빈자리 알림 받기</span>
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
        <article className="flex overflow-hidden flex-col justify-center p-4 bg-white rounded-xl w-[460px]">
            <div className="w-full relative">
                <div className="relative w-full" style={{ paddingTop: '75%' }}>
                    <img
                        src={image}
                        alt={name}
                        className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
                    />
                </div>
                {isNew && (
                    <Badge className="absolute top-2 left-2">NEW</Badge>

                )}
                <div className="flex gap-auto justify-between items-center px-2.5 pb-2.5 mt-4 w-full">
                    <div className="self-stretch my-auto w-[199px]">
                        <h3 className="text-lg font-bold text-neutral-900 whitespace-nowrap overflow-hidden text-ellipsis">{name}</h3>
                        {location && type && (
                            <div className="flex gap-3.5 mt-2.5 w-full text-xs rounded-none">
                                <p className="text-neutral-900">{location}</p>
                                <p className="text-neutral-400">{type}</p>
                            </div>
                        )}
                        <div className="relative top-2 right-0.5">
                            <StarRating name="rating" rating={score} readOnly={true} size="small" />
                        </div>
                    </div>
                    <div className="self-stretch text-right my-auto w-[120px]">
                        <div className="flex overflow-hidden flex-col justify-center items-end px-0.5 py-1 w-full">
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
                        {price !== null && price !== undefined && remainingSpots !== undefined && ( // (설명 추후 삭제) price가 0원일때도 가격이 출력되도록 수정 원래 코드는 price && remainingSpots !== undefined &&
                            <div className="flex flex-col mt-2.5">
                                <p className="text-base font-bold text-fuchsia-700">
                                    {typeof price === 'number'
                                        ? `₩${price.toLocaleString()} ~`
                                        : price.startsWith('₩') ? price : `₩${price} ~`}
                                </p>
                                <p className="mt-1.5 text-xs text-right text-neutral-400">
                                    남은 자리 : {remainingSpots}개
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
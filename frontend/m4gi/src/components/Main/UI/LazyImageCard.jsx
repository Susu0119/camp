import { Badge } from "../../Common/Badge";
import StarRating from "../../Common/StarRating";
import LazyImage from "./LazyImage";
import { useNavigate } from "react-router-dom";

export default function Card({ site }) {
    const navigate = useNavigate();
    const { id, name, location, type, score, price, remainingSpots, image, isNew, isWishlisted } = site;
    
    // 캠핑장 카드 클릭 시, 해당 캠핑장으로 이동
    const handleCardClick = () => {
        navigate(`/detail/${id}`); // id = 캠핑장 아이디 
    }

    return (
        <article className="flex overflow-hidden flex-col justify-center p-4 bg-white rounded-xl w-[340px] cursor-pointer" onClick={handleCardClick}>
            <div className="w-full relative">
                <div className="relative w-full" style={{ paddingTop: '75%' }}>
                    <LazyImage
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
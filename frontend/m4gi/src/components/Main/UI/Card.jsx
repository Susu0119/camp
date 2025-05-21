import { Badge } from "../../Common/Badge";
import StarRating from "../../Common/StarRating";
export default function CampingSiteCard({ site, variant = '' }) {
    const { name, location, type, score, price, remainingSpots, image, isNew } = site;

    if (variant === 'small') {
        return (
            <article className="flex overflow-hidden flex-col justify-center p-4 bg-white rounded-xl w-[340px]">
                <div className="w-full relative">
                    <img
                        src={image}
                        alt={name}
                        className="object-contain w-full rounded-xl aspect-[1.43]"
                    />
                    {isNew && (
                        <Badge className="absolute top-4 left-1">NEW</Badge>

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
                                <img
                                    src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/f491daa67a54343076b045e7fec78d167c793c95?placeholderIfAbsent=true"
                                    alt="Favorite"
                                    className="object-contain aspect-[1.08] stroke-[1.5px] stroke-fuchsia-700 w-[13px]"
                                />
                            </div>
                            {price && remainingSpots !== undefined && (
                                <div className="flex flex-col mt-2.5">
                                    <p className="text-base font-bold text-fuchsia-700">
                                        {typeof price === 'number'
                                            ? `₩${price.toLocaleString()} ~`
                                            : price.startsWith('₩') ? price : `₩${price} ~`}
                                    </p>
                                    <p className="mt-1.5 text-xs text-right text-neutral-400 ">
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

    return (
        <article className="flex overflow-hidden flex-col justify-center p-4 bg-white rounded-xl w-[460px]">
            <div className="w-full relative">
                <img
                    src={image}
                    alt={name}
                    className="object-contain w-full rounded-xl"
                />
                {isNew && (
                    <Badge className="absolute top-2 left-2">NEW</Badge>

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
                            <StarRating name="rating" rating={score} readOnly={true} size="small" />
                        </div>
                    </div>
                    <div className="self-stretch text-right my-auto w-[120px]">
                        <div className="flex overflow-hidden flex-col justify-center items-end px-0.5 py-1 w-full">
                            <img
                                src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/f491daa67a54343076b045e7fec78d167c793c95?placeholderIfAbsent=true"
                                alt="Favorite"
                                className="object-contain aspect-[1.08] stroke-[1.5px] stroke-fuchsia-700 w-[13px]"
                            />
                        </div>
                        {price && remainingSpots !== undefined && (
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
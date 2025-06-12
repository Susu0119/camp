import StarRating from "../../Common/StarRating";

export default function ReviewCard({ review, variant = '', image, site, onReport, isMyReview, isLoggedIn }) {
    const { campName, score, content, author, date } = review;

    if (variant === 'long') {
        return (
            <article className="flex flex-col justify-center p-2.5 w-full bg-white rounded-xl relative">
                <div className="flex flex-wrap gap-6 items-center w-full max-md:max-w-full">
                    {image ? (
                        <img
                            src={image}
                            className="object-fill shrink-0 self-stretch my-auto rounded-xl aspect-[1.76] min-w-60 w-[281px]"
                            alt="캠핑장 리뷰 이미지"
                        />
                    ) : (
                        <div className="no-image shrink-0 self-stretch my-auto rounded-xl aspect-[1.76] min-w-60 w-[281px]">
                            <p>No Image</p>
                        </div>
                    )}
                    <div className="flex flex-col flex-1 shrink self-stretch my-auto basis-0 min-w-60 max-md:max-w-full">
                        <div className="text-lg font-bold text-fuchsia-700 max-md:max-w-full">
                            <StarRating name="rating" rating={score} size='small' readOnly='true' />
                        </div>
                        <p className="mt-2.5 text-base text-neutral-900 max-md:max-w-full">
                            {content}
                        </p>
                        <div className="flex gap-6 items-center self-start mt-2.5 text-sm text-neutral-400">
                            <span className="self-stretch my-auto">{site}</span>
                            <span className="self-stretch my-auto">{author}</span>
                            <time className="self-stretch my-auto">{date}</time>
                        </div>
                    </div>
                </div>
                {isLoggedIn && !isMyReview && (
                    <div className="absolute bottom-4 right-4">
                        <button
                            onClick={onReport}
                            className="px-2 py-1 text-xs text-gray-400 rounded hover:bg-gray-100 hover:text-red-500 transition-colors"
                            aria-label={`${author}님의 리뷰 신고하기`}
                        >
                            신고
                        </button>
                    </div>
                )}
            </article>
        )
    }

    return (
        <article className="grow shrink px-4 py-5 bg-white rounded-lg border border-solid border-slate-200 min-w-60 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] w-[348px] h-[185px] flex flex-col relative">
            <div className="flex gap-10 w-full">
                <h3 className="text-base font-bold tracking-tight text-slate-950">
                    {campName}
                </h3>
                <div className="flex flex-1 justify-end self-start mt-0.5 pr-16">
                    <div className="object-contain shrink-0 w-4 aspect-square">
                        <StarRating name="rating" rating={score} size='small' readOnly='true' />
                    </div>
                </div>
            </div>
            <p className="mt-5 mr-9 text-sm leading-5 text-slate-950 max-md:mr-2.5 flex-1 overflow-hidden">
                {content}
            </p>
            <div className="flex gap-5 justify-between mt-auto text-xs leading-none whitespace-nowrap text-slate-500">
                <span>{author}</span>
                <time dateTime={date}>{date}</time>
            </div>
            {isLoggedIn && !isMyReview && (
                <div className="absolute bottom-4 right-4">
                    <button
                        onClick={onReport}
                        className="px-2 py-1 text-xs text-gray-400 rounded hover:bg-gray-100 hover:text-red-500 transition-colors"
                        aria-label={`${author}님의 리뷰 신고하기`}
                    >
                        신고
                    </button>
                </div>
            )}
        </article>
    );
};

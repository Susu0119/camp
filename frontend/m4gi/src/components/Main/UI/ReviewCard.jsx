import StarRating from "../../Common/StarRating";

export default function ReviewCard({ review }) {
    const { campName, score, content, author, date } = review;

    return (
        <article className="grow shrink px-4 py-5 bg-white rounded-lg border border-solid border-slate-200 min-w-60 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] w-[348px] max-md:max-w-full">
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
            <p className="mt-5 mr-9 text-sm leading-5 text-slate-950 max-md:mr-2.5">
                {content}
            </p>
            <div className="flex gap-5 justify-between mt-6 text-xs leading-none whitespace-nowrap text-slate-500">
                <span>{author}</span>
                <time dateTime={date}>{date}</time>
            </div>
        </article>
    );
};

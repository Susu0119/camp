import React from 'react';
import ReviewCard from './ReviewCard';

export default function ReviewSection({ reviews }) {
    return (
        <section className="flex flex-col mt-5 w-[1440px]">
            <h2 className="text-xl font-bold leading-snug text-slate-950">최근 리뷰</h2>
            <div className="flex flex-wrap gap-2.5 justify-center items-start self-stretch mt-5 w-full max-md:max-w-full">
                {reviews.map((review, index) => (
                    <ReviewCard key={index} review={review} />
                ))}
            </div>
        </section>
    );
}

"use client";
import React, { useState } from "react";

export default function DatePersonSelector() {
    const [dateRange, setDateRange] = useState("05.07 (수) ~ 05.09 (금)");
    const [personCount, setPersonCount] = useState(2);

    return (
        <div className="flex flex-wrap gap-5 items-center mt-8 w-full max-md:max-w-full">
            <div className="flex flex-wrap gap-10 justify-between items-center self-stretch px-5 my-auto rounded-xl border-2 border-solid border-[color:var(--unnamed,#E5E5E5)] min-h-10 min-w-60 w-[760px] max-md:max-w-full">
                <div className="flex gap-2.5 justify-center items-center self-stretch p-2 my-auto w-10 min-h-10">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/3cfb3813c36c4fb01869edc22a56715b08b7d4e3?placeholderIfAbsent=true"
                        className="object-contain self-stretch my-auto w-6 aspect-square"
                        alt="달력"
                    />
                </div>
                <time className="self-stretch my-auto text-base leading-none text-center text-neutral-900">
                    {dateRange}
                </time>
                <button className="flex overflow-hidden flex-col justify-center items-center self-stretch px-1 py-5 my-auto w-10 min-h-10">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/7911c011df4cae934d9fce8e77a52966527fad89?placeholderIfAbsent=true"
                        className="object-contain w-2.5 aspect-[2]"
                        alt="드롭다운"
                    />
                </button>
            </div>
            <div className="flex flex-1 shrink gap-10 justify-between items-center self-stretch px-5 my-auto rounded-xl border-2 border-solid basis-0 border-[color:var(--unnamed,#E5E5E5)] min-w-60">
                <div className="flex gap-2.5 justify-center items-center self-stretch p-2 my-auto w-10 min-h-10">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/6a53713129e933f7c8d0f0a243eb630a9643f7ec?placeholderIfAbsent=true"
                        className="object-contain self-stretch my-auto w-6 aspect-square"
                        alt="인원"
                    />
                </div>
                <span className="self-stretch my-auto text-base leading-none text-center text-neutral-900">
                    인원 {personCount}
                </span>
                <button className="flex overflow-hidden flex-col justify-center items-center self-stretch px-1 py-5 my-auto w-10 min-h-10">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/7911c011df4cae934d9fce8e77a52966527fad89?placeholderIfAbsent=true"
                        className="object-contain w-2.5 aspect-[2]"
                        alt="드롭다운"
                    />
                </button>
            </div>
        </div>
    );
}
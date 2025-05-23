"use client";
import React, { useState } from "react";

function AmenityIcon({ iconSrc, label }) {
    return (
        <div className="flex justify-between items-center self-stretch my-auto whitespace-nowrap min-h-[60px] w-[60px]">
            <div className="flex flex-col justify-center items-center self-stretch my-auto w-[45px]">
                <img
                    src={iconSrc}
                    className="object-contain w-full aspect-square"
                    alt={label}
                />
                <p>{label}</p>
            </div>
        </div>
    );
}

export default function AmenityList() {
    const [showAll, setShowAll] = useState(false);

    return (
        <section className="mt-4 w-full text-sm text-right h-[82px] max-md:max-w-full">
            <button
                className="text-fuchsia-700 max-md:max-w-full"
                onClick={() => setShowAll(!showAll)}
            >
                전체 보기
            </button>
            <div className="flex flex-wrap gap-10 justify-between items-center px-36 mt-2.5 w-full text-neutral-900 max-md:px-5 max-md:max-w-full">
                <AmenityIcon iconSrc="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/b1fd420f27f939203759e5665ddf3d1a26eb9ddc?placeholderIfAbsent=true" label="공용샤워실" />
                <AmenityIcon iconSrc="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/35f1b59785651845a2492855be5e3948f7f948ed?placeholderIfAbsent=true" label="공용화장실" />
                <AmenityIcon iconSrc="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/41aad7c2e2a64bb5125e6b587f1615214de3762b?placeholderIfAbsent=true" label="매점" />
            </div>
        </section>
    );
}

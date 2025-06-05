"use client";
import React from "react";

export default function CampingSiteAttribute({
    type,
    maxPeople,
    typeIcon = "https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/cd7f78edaff0ca57fe214a91f0c1ecb659ae70d7?placeholderIfAbsent=true",
}) {
    return (
        <div className="flex overflow-hidden flex-row flex-1 m-2.5 justify-center py-2.5 mt-4 mb-8 w-[380px] text-sm rounded-xl bg-clpurple text-cpurple">
            <div className="flex flex-row justify-between items-center w-full px-20">
                <div className="flex gap-2.5 items-center whitespace-nowrap">
                    <img
                        src={typeIcon}
                        className="object-contain shrink-0 aspect-square w-4 h-4"
                        alt="캠핑 타입"
                    />
                    <span>{type}</span>
                </div>
                <div className="flex gap-2.5 items-center">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/1623f64f201b010f689805721d54b530b6b3d1d4?placeholderIfAbsent=true"
                        className="object-contain shrink-0 aspect-square w-4 h-4"
                        alt="최대 인원수"
                    />
                    <span>
                        최대 인원수 {maxPeople}명
                    </span>
                </div>
            </div>
        </div>
    );
}


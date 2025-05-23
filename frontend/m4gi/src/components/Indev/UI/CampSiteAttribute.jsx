"use client";
import React from "react";

export default function CampingSiteAttribute({
    type,
    maxPeople,
    deckType,
    size,
    typeIcon = "https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/cd7f78edaff0ca57fe214a91f0c1ecb659ae70d7?placeholderIfAbsent=true",
    checkInIcon = "https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/25785862dd1c11aa48c197d924323e0a7444662c?placeholderIfAbsent=true",
    sizeIcon = "https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/6ffedc2aa66fa1b550b8c955fff2fe3e2bf97574?placeholderIfAbsent=true"
}) {
    return (
        <div className="flex overflow-hidden flex-col flex-1 justify-center px-52 py-2.5 mt-4 mb-8 w-full text-sm rounded-xl bg-neutral-100 text-zinc-500">
            <div className="flex flex-wrap gap-10 justify-between items-center w-full">
                <div className="flex flex-col self-stretch my-auto">
                    <div className="flex gap-2.5 items-center self-start whitespace-nowrap">
                        <img
                            src={typeIcon}
                            className="object-contain shrink-0 self-stretch my-auto aspect-square"
                            alt="캠핑 타입"
                        />
                        <span className="self-stretch my-auto w-[33px]">{type}</span>
                    </div>
                    <div className="flex gap-2.5 items-center mt-2.5 w-full">
                        <img
                            src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/1623f64f201b010f689805721d54b530b6b3d1d4?placeholderIfAbsent=true"
                            className="object-contain shrink-0 self-stretch my-auto aspect-square"
                            alt="최대 인원수"
                        />
                        <span className="self-stretch my-auto">
                            최대 인원수 {maxPeople}명
                        </span>
                    </div>
                </div>
                <div className="flex flex-col self-stretch my-auto">
                    <div className="flex gap-2.5 items-center w-full whitespace-nowrap">
                        <img
                            src={checkInIcon}
                            className="object-contain shrink-0 self-stretch my-auto aspect-square "
                            alt="데크 타입"
                        />
                        <span className="self-stretch my-auto w-[170px]">{deckType}</span>
                    </div>
                    <div className="flex gap-2.5 items-center self-start mt-2.5">
                        <img
                            src={sizeIcon}
                            className="object-contain shrink-0 self-stretch my-auto aspect-square w-[25px]"
                            alt="사이즈"
                        />
                        <span className="self-stretch my-auto">{size}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}



import React from "react";

export default function CampSiteInfo({ campgroundData, clickRoute }) {

    console.log("1. CampSiteInfo:", campgroundData);
    const {
        campground: {
            campground_name = "",
            addr_full = "",
            campground_phone = "",
            totalWishCount = 0
        } = {}
    } = campgroundData || {};

    return (
        <section className="w-full max-md:max-w-full">
            <div className="flex flex-wrap gap-10 justify-between items-center w-full">
                <h2 className="self-stretch my-auto text-2xl font-bold text-neutral-900">
                    {campground_name}
                </h2>
                <div className="flex gap-1.5 self-stretch my-auto text-sm text-fuchsia-700 whitespace-nowrap w-[54px]">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/649d2bb419b807f69e62c63ae6932be67719ae81?placeholderIfAbsent=true"
                        className="object-contain shrink-0 w-6 aspect-square"
                        alt="좋아요"
                    />
                    <span className="text-fuchsia-700 mt-1">{totalWishCount}</span>
                </div>
            </div>
            <div className="flex flex-col items-start mt-4 text-sm w-[320px]">
                <div className="flex gap-2.5 items-center self-stretch w-full">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/5bf3bcbc9cec177db7243e0a6ff4a34bedd759c2?placeholderIfAbsent=true"
                        className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
                        alt="위치"
                    />
                    <address className="self-stretch my-auto text-neutral-900 not-italic">
                        {addr_full}
                    </address>
                    <button type="button" onClick={clickRoute} className="self-stretch cursor-pointer my-auto text-right text-fuchsia-700">
                        길찾기
                    </button>
                </div>
                <div className="flex gap-2.5 items-center mt-2.5 whitespace-nowrap text-neutral-900">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/0fd90e4b8931bc9d162dd37fc6b88bb987b7d00a?placeholderIfAbsent=true"
                        className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
                        alt="전화"
                    />
                    <div className="self-stretch my-auto">
                        {campground_phone}
                    </div>
                </div>
                <button className="flex gap-2.5 items-center mt-2.5 max-w-full text-neutral-900 w-[128px]">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/ee32b55e059f2e487fbbacad559e82e03b83fa59?placeholderIfAbsent=true"
                        className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
                        alt="비디오"
                    />
                    <span className="self-stretch my-auto">캠핑장 영상 보기</span>
                </button>
            </div>
        </section>
    );
}

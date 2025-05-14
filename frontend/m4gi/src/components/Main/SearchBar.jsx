import React from "react";

export default function SearchBar() {
    return (
        <div className="flex flex-1 shrink justify-between items-center self-stretch my-auto basis-0 min-w-60 max-md:max-w-full">
            <div className="flex flex-1 shrink gap-3.5 items-center self-stretch px-2.5 py-1.5 my-auto w-full bg-[#EDDDF4] rounded-xl basis-0 min-w-60 max-md:max-w-full">
                <div className="flex flex-wrap flex-1 shrink gap-2.5 items-center self-stretch my-auto w-full basis-0 min-h-[50px] min-w-60 max-md:max-w-full">
                    <div className="flex flex-col justify-center items-center self-stretch my-auto w-12 min-h-12">
                        <div className="flex overflow-hidden gap-2.5 justify-center items-center w-full max-w-10 rounded-[100px]">
                            <div className="flex gap-2.5 justify-center items-center self-stretch p-2 my-auto w-10">
                                <img
                                    src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/c84c5706ee00778e11b575f67479011f24c86dd3?placeholderIfAbsent=true"
                                    alt="Search"
                                    className="object-contain self-stretch my-auto w-6 aspect-square"
                                />
                            </div>
                        </div>
                    </div>
                    <p className="self-stretch my-auto text-base text-neutral-900">

                    </p>
                </div>
            </div>
        </div>
    );
};

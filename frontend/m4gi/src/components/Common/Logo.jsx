import React from 'react';

export default function Logo({ variant = 'default' }) {
    return (
        <>
        {variant === 'default' && (
            <div className="flex select-none items-center justify-center">
                <img
                    src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/ac1e1903cdffe41cf50fd0a5d741c49309973b46?placeholderIfAbsent=true"
                    alt="Campia Logo"
                    className="object-contain shrink-0 self-stretch my-auto rounded-none aspect-[1.09] w-[120px]"
                />
                <span className="font-['GapyeongWave'] text-5xl font-normal leading-[44px] text-white/80">
                    Campia
                </span>
            </div>
        )}

        {variant === 'small' && (
            <div className="scale-75 flex gap-2.5 select-none font-['GapyeongWave'] items-center self-stretch my-auto text-4xl text-cpurple whitespace-nowrap">
                <img
                    src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/ac1e1903cdffe41cf50fd0a5d741c49309973b46?placeholderIfAbsent=true"
                    alt="Campia Logo"
                    className="object-contain shrink-0 self-stretch my-auto rounded-none aspect-[1.09] w-[59px]"
                />
                <h1 className="self-stretch my-auto text-cpurple">Campia</h1>
            </div>
        )}
        </>
    );
};
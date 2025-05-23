"use client";
import { useState } from 'react';

export default function AppDownload() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="flex overflow-hidden absolute right-4 bottom-20 z-0 flex-col px-4 pt-2.5 pb-6 max-w-full bg-white rounded-lg border border-solid shadow-lg border-slate-200 h-[237px] w-[165px]">
            <div className="flex gap-3 self-end">
                <p className="text-base font-medium text-center text-slate-950">앱 다운로드</p>
                <button
                    className="flex justify-center items-center w-6 h-6 bg-white rounded-full min-h-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
                    onClick={() => setIsVisible(false)}
                    aria-label="Close app download"
                >
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/a0f6ec8943c9140f7e4278198a6be02a1d2b17a2?placeholderIfAbsent=true"
                        alt="Close"
                        className="object-contain self-stretch my-auto w-4 aspect-square"
                    />
                </button>
            </div>
            <div className="flex flex-col justify-center items-center px-4 mt-4 w-full bg-gray-200 rounded-md h-[132px] max-md:mr-2">
                <div className="overflow-hidden max-w-full min-h-[100px] w-[100px]">
                    <div className="flex overflow-hidden flex-col justify-center items-center w-full min-h-[100px]">
                        <img
                            src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/e2ea7f5b248c7d6c571fcb3e95060179d86807fd?placeholderIfAbsent=true"
                            alt="QR Code"
                            className="object-contain w-full aspect-square"
                        />
                    </div>
                </div>
            </div>
            <p className="self-center mt-2 text-xs leading-4 text-center text-slate-500">
                QR코드를 스캔하여
                <br />
                앱을 다운로드하세요
            </p>
        </div>
    );
};

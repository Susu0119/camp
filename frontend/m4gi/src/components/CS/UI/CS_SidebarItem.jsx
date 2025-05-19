import React from 'react';

export default function SidebarItem({ text, image, onClick, isCategory = false }) {
    if (isCategory) {
        return (
            <div className="my-2 px-4">
                <div className="flex items-center">
                    <span className="text-sm font-normal text-[#71717a]">
                        {text}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex items-center px-4 py-2.5 rounded-md cursor-pointer hover:bg-[#f4f4f5]"
            onClick={onClick}
        >
            <div className="w-4 h-4 mr-2 mb-1">
                {image}
            </div>
            <div className="flex items-center">
                <span className="text-sm font-bold text-black">
                    {text}
                </span>
            </div>
        </div>
    );
};
import React from 'react';

export default function CSMenuButton({ text, onClick }) {
    return (
        <div className="flex">
            <button
                className="flex items-center justify-center w-full h-24 bg-white border border-[#e4e4e7] rounded-md cursor-pointer transition duration-200 hover:shadow-md"
                onClick={onClick}
            >
                <span className="text-lg font-bold text-black">
                    {text}
                </span>
            </button>
        </div>
    );
};
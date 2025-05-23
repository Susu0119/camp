import React from "react";

export default function Divider({ className = "" }) {
    return (
        <div className={`flex flex-col justify-center w-full rotate-[8.742277657347563e-8rad] max-md:max-w-full ${className}`}>
            <hr className="w-full border border-solid bg-stone-300 border-stone-300 min-h-px max-md:max-w-full" />
        </div>
    );
}

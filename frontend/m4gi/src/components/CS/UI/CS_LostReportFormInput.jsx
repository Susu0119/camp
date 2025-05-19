import React from "react";

export default function FormInput({
    label,
    placeholder,
    value,
    onChange,
    className = "",
}) {
    return (
        <div className={`flex flex-col pt-1.5 w-full text-sm ${className}`}>
            <label className="self-start leading-none">{label}</label>
            <div className="flex overflow-hidden flex-col justify-center px-3.5 py-2.5 mt-3.5 bg-white rounded-md border border-solid border-zinc-200 text-zinc-500 max-md:pr-5 max-md:max-w-full">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="overflow-hidden py-px h-5 w-full outline-none bg-transparent"
                />
            </div>
        </div>
    );
};

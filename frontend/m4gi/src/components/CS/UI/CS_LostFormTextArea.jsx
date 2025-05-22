import React from "react";

export default function CSLostFormTextArea({
    label,
    placeholder,
    value,
    onChange,
    className = "",
}) {
    return (
        <div className={`flex flex-col pt-1.5 w-full text-sm ${className}`}>
            <label className="self-start leading-none">{label}</label>
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="overflow-hidden px-3.5 pt-2.5 pb-24 mt-3.5 leading-none bg-white rounded-md border border-solid border-zinc-200 text-zinc-500 w-full resize-none outline-none max-md:pr-5 max-md:max-w-full"
            />
        </div>
    );
};
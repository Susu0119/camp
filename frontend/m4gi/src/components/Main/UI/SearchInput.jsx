import React from "react";

export default function SearchInput({ icon, placeholder, iconAlt = "Search icon" }) {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex h-[50px] w-full items-center gap-3.5 rounded-xl bg-[#E5E5E5] px-2.5 py-1.5">
        <div className="flex h-full flex-1 items-center gap-2.5 min-w-0">
          <div className="flex h-full w-12 items-center justify-center">
            <img src={icon} alt={iconAlt} className="object-contain my-auto w-6 aspect-square" />
          </div>
          <p className="flex-1 my-auto select-none text-[#71717A] truncate">{placeholder}</p>
        </div>
      </div>
    </div>
  );
}

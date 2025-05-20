import React from "react";

export default function SearchInput({ icon, placeholder, iconAlt = "Search icon" }) {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex flex-1 gap-3.5 items-center my-auto w-full rounded-xl bg-[#E5E5E5] px-2.5 py-1.5 h-[60px]">
        <div className="flex gap-2.5 items-center my-auto w-[388px]">
          <div className="flex gap-2.5 items-center p-3 my-auto w-12">
            <img src={icon} alt={iconAlt} className="object-contain my-auto w-6 aspect-square" />
          </div>
          <p className="flex-1 gap-2.5 my-auto text-base select-none text-[#71717A]">{placeholder}</p>
        </div>
      </div>
    </div>
  );
}

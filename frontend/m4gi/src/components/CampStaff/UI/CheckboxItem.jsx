import React from "react";

export default function CheckboxItem({ label }) {
  return (
    <>
      <div className="flex overflow-hidden flex-col justify-center items-center w-10 h-10 bg-white rounded-md min-h-10">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/a73921d05c7840ed357952b5fc00a62d979d5185?placeholderIfAbsent=true&apiKey=099b23ec000d457d89ff08f1378a644f"
          className="object-contain w-6 aspect-square"
          alt="Checkbox"
        />
      </div>
      <div className="overflow-hidden py-2.5 text-sm leading-none bg-white rounded-md min-h-10 text-zinc-500 w-[100px]">
        {label}
      </div>
    </>
  );
}

import React from "react";

const FormInput = ({ placeholder, className = "" }) => {
  return (
    <div
      className={`h-10 flex items-center px-3 w-full bg-white rounded border border-[#e5e5e5] text-[#71717a] ${className}`}
    >
      <input
        type="text"
        placeholder={placeholder}
        className="w-full text-sm bg-transparent outline-none"
      />
    </div>
  );
};

export default FormInput;

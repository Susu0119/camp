import React from "react";

const FormInput = ({ placeholder, className = "", value, onChange, type = "text", ...props }) => {
  return (
    <div
      className={`h-10 flex items-center px-3 w-full bg-white rounded border border-[#e5e5e5] text-[#71717a] ${className}`}
    >
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full text-sm bg-transparent outline-none"
        {...props}
      />
    </div>
  );
};

export default FormInput;

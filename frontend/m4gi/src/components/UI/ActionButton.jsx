import React from "react";

const ActionButton = ({ children, className = "" }) => {
  return (
    <button
      className={`h-10 w-full bg-[#8C06AD] rounded text-white font-bold text-sm ${className}`}
    >
      {children}
    </button>
  );
};

export default ActionButton;

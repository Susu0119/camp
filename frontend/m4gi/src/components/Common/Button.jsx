import React from "react";

const Button = ({ children, className = "", onClick, ...props }) => {
    return (
        
        <button
            onClick={onClick}
            className={`h-10 w-full bg-[#8C06AD] rounded-lg text-white font-bold text-sm ${className}`}
            {...props}
       >
            {children} {/* 렌더링 할 텍스트 */}
        </button>
    );
};

export default Button;

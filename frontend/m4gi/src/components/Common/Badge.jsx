import React from 'react';

export function Badge({ children, className = '', variant, ...props }) {
    return (
        <span
            {...props}
            className={
                (variant === 'card') ?
                    // 이 부분은 기존 Badge의 스타일입니다.
                    `select-none inline-block px-2 text-xs relative top-[-4px] font-semibold bg-[#16A34A] text-white rounded-full ` +
                    className :
                    `select-none inline-block px-2 py-1 text-xs font-semibold bg-[#16A34A] text-white rounded-full ` +
                    className
            }
        >
            {/* children을 내부 span으로 감싸고, 이 span에 미세 조정을 위한 스타일을 적용합니다. */}
            <span className="relative" style={{ top: '1.5px' }}> {/* 필요에 따라 '0.5px' 값을 조정하세요. */}
                {children}
            </span>
        </span>
    );
}
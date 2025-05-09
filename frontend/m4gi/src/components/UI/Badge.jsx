import React from 'react';

export function Badge({ children, className = '', ...props }) {
    return (
        <span
            {...props}
            className={
                `inline-block px-2 py-1 text-xs font-semibold
         bg-green-100 text-green-700 rounded-full ` +
                className
            }
        >
            {children}
        </span>
    );
}
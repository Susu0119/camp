import React from 'react';

export function Button({ children, className = '', ...props }) {
    return (
        <button
            {...props}
            className={
                `px-4 py-2 rounded-md font-medium transition
         bg-green-700 hover:bg-green-800 text-white ` +
                className
            }
        >
            {children}
        </button>
    );
}
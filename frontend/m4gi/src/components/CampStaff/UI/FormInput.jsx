import React from "react";

export default function FormInput({ isTextarea = false, className = "", ...props }) {
  return (
    <div className="flex gap-2 mt-4 w-full">
      {isTextarea ? (
        <textarea
          {...props}
          className={`w-full px-5 py-4 rounded-md border border-cgray focus:border-fuchsia-700 focus:outline-none ${className}`}
        />
      ) : (
        <input
          {...props}
          className={`w-full px-4 py-2 rounded-md border border-cgray focus:border-fuchsia-700 focus:outline-none ${className}`}
        />
      )}
    </div>
  );
}

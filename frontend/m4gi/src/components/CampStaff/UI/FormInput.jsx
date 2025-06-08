import React from "react";

export default function FormInput({ placeholder, isTextarea = false, className = "" }) {
  return (
    <div className="flex gap-2 items-start w-full mt-3">
      {isTextarea ? (
        <textarea
          placeholder={placeholder}
          className={`w-full px-5 py-4 rounded-md border border-cgray focus:border-fuchsia-700 focus:outline-none ${className}`}
        />
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          className={`w-full px-4 py-2 rounded-md border border-cgray focus:border-fuchsia-700 focus:outline-none ${className}`}
        />
      )}
    </div>
  );
}

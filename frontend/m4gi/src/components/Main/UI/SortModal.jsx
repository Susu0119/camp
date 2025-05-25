import React, { useRef, useEffect, useState } from "react";

export default function SortModal ({ isOpen, onClose, onSelect, selectedOption }) {
  if (!isOpen) return null;

  const options = [
    { id: "price_low", label: "가격 낮은순" },
    { id: "price_high", label: "가격 높은순" },
    { id: "rating_high", label: "평점 높은순" },
    { id: "most_popular", label: "인기순" },
    { id: "date_desc", label: "최신 등록일 순" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-xl shadow-lg w-64 overflow-hidden z-10">
        <div className="flex flex-col">
          {options.slice(0, 2).map((option) => (
            <button
              key={option.id}
              className={`px-4 py-3 text-left hover:bg-gray-100 ${
                selectedOption === option.id ? "text-fuchsia-700 font-medium" : "text-neutral-900"
              }`}
              onClick={() => onSelect(option.id, option.label)}
            >
              {option.label}
            </button>
          ))}

          <div className="h-px bg-gray-200 mx-4"></div>

          {options.slice(2).map((option) => (
            <button
              key={option.id}
              className={`px-4 py-3 text-left hover:bg-gray-100 ${
                selectedOption === option.id ? "text-fuchsia-700 font-medium" : "text-neutral-900"
              }`}
              onClick={() => onSelect(option.id, option.label)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
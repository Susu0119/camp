import React, { useRef, useEffect } from "react";

export default function SortModal ({ isOpen, onClose, onSelect, selectedOption }) {
  const modalRef = useRef(null);

  const options = [
    { id: "price_low", label: "가격 낮은순" },
    { id: "price_high", label: "가격 높은순" },
    { id: "rating_high", label: "평점 높은순" },
    { id: "most_popular", label: "인기순" },
    { id: "date_desc", label: "최신 등록일 순" }
  ];

  // 모달창 바깥 클릭 혹은 Esc 클릭 시 모달창 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };
    const handleEsc = (e) => {
      if(e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-full mt-1 left-1 z-50">
      <div ref={modalRef} className="bg-white rounded-xl shadow-lg w-30 border border-gray-200">
        <div className="flex flex-col divide-y divide-gray-200">
          {options.map((option) => (
            <button
              key={option.id}
              className={`px-4 py-3 w-full text-sm rounded-md hover:bg-gray-100 transition ${
                selectedOption === option.id ? "text-cpurple font-medium" : "text-black"
              }`}
              onClick={() => onSelect(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
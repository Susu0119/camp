import React from "react";

const ReservationFilter = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: "active", label: "예약중" },
    { id: "completed", label: "이용 완료" },
    { id: "cancelled", label: "취소/환불" },
  ];

  return (
    <div className="flex gap-2 justify-start flex-wrap px-2.5 pt-5 pb-2.5 w-full max-w-4xl">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-4 pt-3 pb-2.5 h-10 text-sm font-bold text-center rounded-md cursor-pointer 
              w-[109px] max-sm:flex-1 max-sm:px-3 max-sm:py-2 max-sm:w-auto max-sm:text-xs max-sm:min-w-20
              ${isActive
                ? "bg-[#8C06AD] text-white"
                : "bg-purple-200 text-fuchsia-700 hover:bg-purple-300"}`}
            aria-pressed={isActive}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};

export default ReservationFilter;

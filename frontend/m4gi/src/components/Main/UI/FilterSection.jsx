import React, { useRef, useEffect, useState } from "react";
import FilterTag from "./FilterTag";
import SortModal from "./SortModal";


const FilterButton = () => {
    return (
    <button className="flex items-center text-center px-5 py-3.5 my-auto h-10 text-sm whitespace-nowrap rounded-xl bg-clpurple">
      <div className="flex gap-2.5 items-center w-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
        <span>필터</span>
      </div>
    </button>
  );
};

const SortSelector = ({ label, onClick }) => {
  return (
    <button className="flex gap-2 items-center my-auto whitespace-nowrap cursor-pointer" onClick={onClick}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
        </svg>
        <span className="self-stretch my-auto text-sm">{label}</span>
    </button>
  );
};

export default function FilterSection () {
  // ★ 가격 낮은순 클릭 시, 정렬 방식 변경 가능, default : 가격 낮은순
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState("price_low");
  const [sortLabel, setSortLabel] = useState("가격 낮은순");

  const handleSortClick = () => {
    setIsSortModalOpen(true);
  };

  const handleSortSelect = (optionId, optionLabel) => {
    setSortOption(optionId);
    setSortLabel(optionLabel);
    setIsSortModalOpen(false);
  };

  // ★ 태그 좌우 슬라이드 기능
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const slider = scrollRef.current;

    const onMouseDown = (e) => {
      isDragging.current = true;
      startX.current = e.pageX - slider.offsetLeft;
      scrollLeft.current = slider.scrollLeft;
      slider.classList.add("cursor-grabbing");
    };

    const onMouseLeave = () => {
      isDragging.current = false;
      slider.classList.remove("cursor-grabbing");
    };

    const onMouseUp = () => {
      isDragging.current = false;
      slider.classList.remove("cursor-grabbing");
    };

    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX.current) * 1; // 스크롤 속도 조절 가능
      slider.scrollLeft = scrollLeft.current - walk;
    };

    slider.addEventListener("mousedown", onMouseDown);
    slider.addEventListener("mouseleave", onMouseLeave);
    slider.addEventListener("mouseup", onMouseUp);
    slider.addEventListener("mousemove", onMouseMove);

    return () => {
      slider.removeEventListener("mousedown", onMouseDown);
      slider.removeEventListener("mouseleave", onMouseLeave);
      slider.removeEventListener("mouseup", onMouseUp);
      slider.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <section>
      <div className="flex gap-4 w-full min-w-0">
        <FilterButton />
        <div
            ref={scrollRef}
            className="flex overflow-x-auto whitespace-nowrap gap-2.5 items-center leading-none text-center select-none [&::-webkit-scrollbar]:hidden"
        >
          <FilterTag text="벚꽃명소" />
          <FilterTag text="캠핑 입문자 추천" />
          <FilterTag text="아이들과 함께" />
          <FilterTag text="반려견과 함께" />
          <FilterTag text="주말에는 뭐하지" />
          <FilterTag text="반려견과 함께" />
          <FilterTag text="반려견과 함께" />
          <FilterTag text="반려견과 함께" />
          <FilterTag text="반려견과 함께" />
          <FilterTag text="반려견과 함께" />
          <FilterTag text="반려견과 함께" />
          <FilterTag text="반려견과 함께" />
          <FilterTag text="반려견과 함께" />
          <FilterTag text="반려견과 함께" />
          <FilterTag text="반려견과 함께" />
        </div>
        <SortSelector
          label={sortLabel}
          onClick={handleSortClick}
        />
      </div>

      {/* 정렬 변경 모달창 */}
      <SortModal
        isOpen={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        onSelect={handleSortSelect}
        selectedOption={sortOption}
      />
    </section>
  );
};

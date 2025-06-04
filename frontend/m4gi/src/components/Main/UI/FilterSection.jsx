import React, { useRef, useEffect, useState } from "react";
import FilterTag from "./FilterTag";
import SortModal from "./SortModal";
import FilterModal from "./FilterModal";
import { tagPresets } from "./FilterTagPresets";

const options = [
  { id: "price_low", label: "가격 낮은순" },
  { id: "price_high", label: "가격 높은순" },
  { id: "rating_high", label: "평점 높은순" },
  { id: "most_popular", label: "인기순" },
  { id: "date_desc", label: "최신 등록일 순" }
];

const FilterButton = ({ onClick }) => {
    return (
    <button type="button" onClick={ onClick }className="flex items-center text-center px-5 py-3.5 my-auto h-10 text-sm whitespace-nowrap rounded-xl bg-clpurple cursor-pointer">
      <div className="flex gap-2.5 items-center w-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
        <span>필터</span>
      </div>
    </button>
  );
};

const SortSelector = ({ label, onClick }) => {
  return (
    <button className="flex gap-2 items-center my-auto whitespace-nowrap cursor-pointer" onClick={onClick}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
        </svg>
        <span className="self-stretch my-auto text-sm">{label}</span>
    </button>
  );
};

export default function FilterSection ( { sortOption, setSortOption, draftFilter, setDraftFilter, onApplyFilter, setAppliedFilter, setPage, setCamplist, setHasMore } ) {
  
  // ★ 필터 모달창 + 클릭된 필터 저장
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const toggleFeature = (field, value) => {
    setDraftFilter((prev) => {
      const list = prev[field];
      const newList = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      return {
        ... prev,
        [field]: newList
      }
    });
  };

  // ★ 가격 낮은순 클릭 시, 정렬 방식 변경 가능, default : 가격 높은순
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const currentLabel = options.find(opt => opt.id === sortOption)?.label || "가격 높은순";

  const handleSortClick = () => {
    setIsSortModalOpen(true);
  };

  const handleSortSelect = (optionId) => {
    setSortOption(optionId);
    setIsSortModalOpen(false);
  };

  const handleFilterClick = () => {
    setIsFilterModalOpen(true);
  }

  const handleTagClick = (preset) => {
    const { filters } = preset;

    //draftfilter 갱신
    setDraftFilter(prev => ({
      ...prev,
      ...filters
    }));

    // 적용 필터 갱신
    setAppliedFilter(prev => ({
      ...prev,
      ...filters
    }));

    // 페이지 초기화 및 검색 재요청
    setPage(0);
    setCamplist([]);
    setHasMore(true);
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
      <div className="flex justify-between w-full min-w-0">
        <div className="relative">
          {/* 필터 선택 모달창 */}
          <FilterButton onClick={() => handleFilterClick()} />
          <FilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            draftFilter={draftFilter}
            toggleFeature={toggleFeature}
            onApplyFilter={onApplyFilter}
          />
        </div>
        <div
            ref={scrollRef}
            className="flex overflow-x-auto w-full px-2.5 whitespace-nowrap gap-2.5 leading-none select-none [&::-webkit-scrollbar]:hidden"
        >
          {tagPresets.map((preset, idx) => (
            <FilterTag 
              key = {idx}
              text = {preset.label}
              onClick = {() => handleTagClick(preset)}
            />
          ))}
        </div>
        <div className="relative items-center flex">
          <SortSelector
            label={currentLabel}
            onClick={handleSortClick}
          />

          {/* 정렬 변경 모달창 */}
          <SortModal
            isOpen={isSortModalOpen}
            onClose={() => setIsSortModalOpen(false)}
            onSelect={handleSortSelect}
            selectedOption={sortOption}
          />
        </div>
      </div>
    </section>
  );
};

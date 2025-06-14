import React from 'react';

const Pagination = ({ currentPage, totalPages, onChange, pageRange = 2 }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = Math.max(1, currentPage - pageRange); i <= Math.min(totalPages, currentPage + pageRange); i++) {
    pages.push(i);
  }

  // 공통 색상 클래스 변수
  const activeBtn = 'text-purple-900 font-extrabold';
  const baseBtn = 'hover:text-purple-900 text-purple-600/60 font-medium';
  const arrowBtn = 'text-purple-300';

  return (
    <div className="flex justify-center mt-6 gap-2 text-lg select-none">
      {/* << */}
      <button
        className={`${arrowBtn} px-2 cursor-pointer`}
        disabled={currentPage === 1}
        onClick={() => onChange(1)}
        aria-label="첫 페이지"
      >
        {'<<'}
      </button>
      {/* < */}
      <button
        className={`${arrowBtn} px-2 cursor-pointer`}
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
        aria-label="이전 페이지"
      >
        {'<'}
      </button>
      {/* 맨 앞 ... */}
      {pages[0] > 1 && (
        <>
          <button
            className={`${baseBtn} px-2 cursor-pointer`}
            onClick={() => onChange(1)}
          >
            1
          </button>
          {pages[0] > 2 && <span className="px-2 text-purple-600/60">...</span>}
        </>
      )}
      {/* 페이지 번호 */}
      {pages.map((i) => (
        <button
         key={i}
         onClick={() => onChange(i)}
         style={{
         outline: 'none',
         boxShadow: 'none',
         WebkitTapHighlightColor: 'transparent' // 모바일에서 남는 테두리 제거
      }}
    className={`cursor-pointer px-2 text-lg
      ${currentPage === i ? activeBtn : baseBtn}`}
    >
    {i}
  </button>
      ))}
      {/* 맨 뒤 ... */}
      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="px-2 text-purple-600/60">...</span>}
          <button
            className={`${baseBtn} px-2 cursor-pointer`}
            onClick={() => onChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}
      {/* > */}
      <button
        className={`${arrowBtn} px-2 cursor-pointer`}
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
        aria-label="다음 페이지"
      >
        {'>'}
      </button>
      {/* >> */}
      <button
        className={`${arrowBtn} px-2 cursor-pointer`}
        disabled={currentPage === totalPages}
        onClick={() => onChange(totalPages)}
        aria-label="마지막 페이지"
      >
        {'>>'}
      </button>
    </div>
  );
};

export default Pagination;
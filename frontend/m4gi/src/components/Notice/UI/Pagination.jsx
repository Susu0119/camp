"use client";
import React from 'react';

export const Pagination = () => {
  return (
    <nav className="flex gap-1 items-center h-6 max-sm:flex-wrap max-sm:gap-0.5" aria-label="Pagination">
      <button className="flex gap-1 justify-center items-center py-2.5 pr-4 pl-2.5 rounded-md max-sm:px-3 max-sm:py-2">
        <div>
          <div
            dangerouslySetInnerHTML={{
              __html:
                "<svg id=\"351:4400\" width=\"17\" height=\"17\" viewBox=\"0 0 17 17\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" class=\"pagination-arrow\" style=\"width: 16px; height: 16px\"> <path d=\"M10.5 12.6633L6.5 8.66333L10.5 4.66333\" stroke=\"black\" stroke-width=\"1.33333\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path> </svg>",
            }}
          />
        </div>
        <span className="text-sm leading-5 text-black max-sm:text-xs">
          Previous
        </span>
      </button>
      <button className="gap-1 py-2.5 pr-4 pl-2.5 text-sm leading-5 text-center text-black rounded-md max-sm:px-3 max-sm:py-2 max-sm:text-xs">
        1
      </button>
      <button className="gap-1 py-2.5 pr-4 pl-2.5 text-sm leading-5 text-center text-black rounded-md max-sm:px-3 max-sm:py-2 max-sm:text-xs">
        2
      </button>
      <button className="gap-1 py-2.5 pr-4 pl-2.5 text-sm leading-5 text-center text-black rounded-md max-sm:px-3 max-sm:py-2 max-sm:text-xs">
        3
      </button>
      <button className="flex gap-1 justify-center items-center py-2.5 pr-4 pl-2.5 rounded-md max-sm:px-3 max-sm:py-2">
        <span className="text-sm leading-5 text-black max-sm:text-xs">
          Next
        </span>
        <div>
          <div
            dangerouslySetInnerHTML={{
              __html:
                "<svg id=\"351:4411\" width=\"17\" height=\"17\" viewBox=\"0 0 17 17\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" class=\"pagination-arrow\" style=\"width: 16px; height: 16px\"> <path d=\"M6.5 12.6633L10.5 8.66333L6.5 4.66333\" stroke=\"black\" stroke-width=\"1.33333\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path> </svg>",
            }}
          />
        </div>
      </button>
    </nav>
  );
};

export default Pagination;

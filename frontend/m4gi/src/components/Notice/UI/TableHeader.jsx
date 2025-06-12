import React from 'react';

export const TableHeader = () => {
  return (
    <thead>
      <tr className="flex gap-20 items-center px-7 py-3.5 w-full border-solid border-b-[0.667px] border-b-zinc-200 max-md:gap-10 max-md:px-5 max-md:py-3 max-sm:gap-5 max-sm:px-4 max-sm:py-2.5">
        <th className="w-10 text-sm font-medium leading-5 text-zinc-500 max-sm:text-xs max-sm:w-[30px]">
          번호
        </th>
        <th className="h-5 text-sm font-medium leading-5 text-zinc-500 w-[732px] max-md:w-[400px] max-sm:text-xs max-sm:w-[300px] text-left">
          제목
        </th>
        <th className="h-5 text-sm font-medium leading-5 text-center text-zinc-500 w-[39px] max-sm:w-20 max-sm:text-xs">
          작성일
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;

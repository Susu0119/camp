import React from 'react';

export const TableRow = ({ number, title, date }) => {
  return (
    <tr className="flex shrink-0 gap-14 items-center pt-4 pr-5 pb-4 pl-9 w-full border-solid border-b-[0.667px] border-b-zinc-200 h-[54px] max-md:gap-8 max-md:px-5 max-md:py-3.5 max-sm:gap-5 max-sm:px-4 max-sm:py-3 max-sm:h-auto max-sm:min-h-12">
      <td className="text-sm leading-5 text-center text-black max-sm:text-xs">
        {number}
      </td>
      <td className="gap-2 text-sm leading-5 text-black flex-[1_0_0] max-md:gap-1.5 max-sm:text-xs">
        {title}
      </td>
      <td className="text-sm leading-5 text-center text-black max-sm:text-xs">
        {date}
      </td>
    </tr>
  );
};
export default TableRow;
import React from 'react';

export const TableHeader = ({ isAdmin }) => {
  return (
    <thead>
      <tr className="grid grid-cols-12 items-center px-6 py-3 border-b text-sm font-semibold text-zinc-500">
        <th className="col-span-1 text-center">번호</th>
        <th className="col-span-7 text-left">제목</th>
        <th className="col-span-2 text-center">작성일</th>
        {isAdmin ? (
          <th className="col-span-2 text-center">관리</th>
        ) : (
          <th className="col-span-2" /> // 빈 공간 고정
        )}
      </tr>
    </thead>
  );
};



export default TableHeader;

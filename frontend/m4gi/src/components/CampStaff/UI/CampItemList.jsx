import React from "react";

export default function CampItemList({ items, labelKey = "name", subLabelKey, onEdit, onDelete }) {
  return (
    <div className="border border-zinc-300 rounded-md p-4 w-full">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between py-2 px-2 border-b border-zinc-300 last:border-none"
        >
          {/* 라벨 + 서브 라벨 */}
          <div className="flex gap-6">
            <span className="w-20">{item[labelKey]}</span>
            {subLabelKey && <span className="w-20">{item[subLabelKey]}</span>}
          </div>

          {/* 버튼 */}
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded bg-cpurple text-white"
              onClick={() => onEdit(item)}
            >
              수정
            </button>
            <button
              className="px-3 py-1 rounded bg-clpurple text-cpurple"
              onClick={() => onDelete(item)}
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

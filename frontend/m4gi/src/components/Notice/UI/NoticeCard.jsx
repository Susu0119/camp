import React from "react";
import NoticeContent from "./NoticeContent";

const formatDate = (dateArr) =>
  Array.isArray(dateArr)
    ? `${dateArr[0]}-${String(dateArr[1]).padStart(2, "0")}-${String(
        dateArr[2]
      ).padStart(2, "0")}`
    : dateArr?.slice(0, 10);

const NoticeCard = ({ notice }) => (
  <article className="px-px py-6 w-full bg-white rounded-lg border border-zinc-200 shadow">
    {/* 제목 */}
    <header className="mx-6 text-xl font-bold text-zinc-950">
      {notice.noticeTitle}
    </header>

    {/* 날짜 */}
    <div className="mx-6 mt-3 text-sm text-gray-500 flex items-center gap-1">
      {/* <img
        src="/calendar.svg" alt="cal" className="w-4 aspect-square"
      /> */}
      <time>{formatDate(notice.createdAt)}</time>
    </div>

    <hr className="mt-3 bg-zinc-200 h-px" />

    {/* 본문 */}
    <NoticeContent content={notice.noticeContent} />
  </article>
);

export default NoticeCard;

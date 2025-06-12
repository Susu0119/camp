import React from 'react';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';

const announcements = [
  { id: "1", title: "[중요] 시스템 점검 안내", date: "2025-05-14" },
  { id: "2", title: "2025년 상반기 서비스 업데이트 안내", date: "2025-05-10" },
  { id: "3", title: "개인정보처리방침 개정 안내", date: "2025-05-05" },
  { id: "4", title: "모바일 앱 출시 안내", date: "2025-04-28" },
  { id: "5", title: "고객센터 운영시간 변경 안내", date: "2025-04-20" },
  { id: "6", title: "서비스 이용약관 변경 안내", date: "2025-04-15" },
  { id: "7", title: "신규 기능 추가 안내", date: "2025-04-10" },
  { id: "8", title: "결제 시스템 개선 안내", date: "2025-04-05" },
  { id: "9", title: "연휴 기간 고객센터 운영 안내", date: "2025-03-28" },
  { id: "10", title: "서비스 안정화 작업 완료 안내", date: "2025-03-20" },
];

export const AnnouncementTable = () => {
  return (
    <div className="flex flex-col items-start p-0 w-full rounded-md border border-solid border-zinc-200 max-sm:overflow-x-auto">
      <table className="flex flex-col justify-center items-start w-full max-sm:min-w-[600px]">
        <TableHeader />
        <tbody className="flex flex-col justify-center items-start w-full h-[530px]">
          {announcements.map((announcement) => (
            <TableRow
              key={announcement.id}
              number={announcement.id}
              title={announcement.title}
              date={announcement.date}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AnnouncementTable;
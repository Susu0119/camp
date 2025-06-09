"use client";
import React from "react";
import CampItemList from "./CampItemList";

export default function RegisteredItemsSection({ zones = [], sites = [] }) {
  return (
    <div className="p-4">
      <header className="flex flex-col gap-2 mb-4">
        <h2 className="text-xl text-cpurple">등록된 항목 확인</h2>
        <p className="text-sm text-zinc-500">현재까지 등록된 존과 사이트 목록입니다.</p>
      </header>
      
      <div className="space-y-6">
        {/* 존 목록 섹션 - zones 배열에 항목이 1개 이상 있을 때만 이 부분을 보여줌 */}
        {zones.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">등록된 존 ({zones.length}개)</h3>
            <ul className="list-disc list-inside space-y-1 bg-slate-50 p-4 rounded-md">
              {zones.map(zone => (
                <li key={zone.zoneId}>
                  <span className="font-medium">{zone.zoneName}</span> (ID: {zone.zoneId})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 사이트 목록 섹션 - sites 배열에 항목이 1개 이상 있을 때만 이 부분을 보여줌 */}
        {sites.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">등록된 사이트 ({sites.length}개)</h3>
            <ul className="list-disc list-inside space-y-1 bg-slate-50 p-4 rounded-md">
              {sites.map(site => (
                <li key={site.siteId}>
                  <span className="font-medium">{site.siteName}</span>
                  {/* 백엔드에서 zone_name을 JOIN해서 보내줬다면 표시 가능 */}
                  {site.zoneName && ` (소속 존: ${site.zoneName})`}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 등록된 항목이 하나도 없을 때 표시 */}
        {zones.length === 0 && sites.length === 0 && (
            <p className="text-zinc-500 text-center py-4">아직 등록된 존이나 사이트가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

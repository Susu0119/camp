import React from "react";
import Button from "../../Common/Button";

// ★ 부모로부터 삭제 관련 핸들러 함수들을 props로 받습니다.
export default function RegisteredItemsSection({ zones = [], sites = [], onDeactivateZone, onActivateZone, onDeleteZone, onDeactivateSite, onActivateSite, onDeleteSite, onEditZone, onEditSite }) {
  return (
    <div className="p-4">
      <header className="flex flex-col gap-2 mb-4">
        <h2 className="text-xl text-cpurple">등록된 항목 확인</h2>
        <p className="text-sm text-zinc-500">현재까지 등록된 존과 사이트 목록입니다. 비활성화된 항목은 수정할 수 없습니다.</p>
      </header>

      <div className="space-y-6">
        {/* 존 목록 섹션 */}
        {zones.length > 0 && (
          <div>
            <h3 className="text-cpurple mb-2">등록된 존 ({zones.length}개)</h3>
            <ul className="space-y-2">
              {zones.map((zone) => (
                <li key={zone.zoneId} className={`flex justify-between items-center p-3 rounded-md transition-colors duration-300 ${zone.active ? "bg-slate-50" : "bg-red-50"}`}>
                  <div>
                    <span>{zone.zoneName}</span>
                    <span className="text-sm text-gray-500 ml-2">(ID: {zone.zoneId})</span>
                    {!zone.active && <span className="ml-2 text-xs font-bold text-red-600 bg-red-200 px-2 py-1 rounded-full">비활성</span>}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => onEditZone(zone.zoneId)} className="text-sm text-white bg-cpurple disabled:bg-gray-300" disabled={!zone.active}>
                      수정
                    </Button>

                    {zone.active ? (
                      <Button onClick={() => onDeactivateZone(zone.zoneId, zone.zoneName)} className="text-sm bg-clpurple text-cpurple">
                        비활성화
                      </Button>
                    ) : (
                      <>
                        <Button onClick={() => onActivateZone(zone.zoneId, zone.zoneName)} className="text-sm bg-[#00baad] text-white">
                          활성화
                        </Button>
                        <Button onClick={() => onDeleteZone(zone.zoneId, zone.zoneName)} className="text-sm bg-[#ff4068] text-white">
                          영구 삭제
                        </Button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 사이트 목록 섹션 */}
        {sites.length > 0 && (
          <div>
            <h3 className="text-cpurple mb-2">등록된 사이트 ({sites.length}개)</h3>
            <ul className="space-y-2">
              {sites.map((site) => (
                <li key={site.siteId} className={`flex justify-between items-center p-3 rounded-md transition-colors duration-300 ${site.active ? "bg-slate-50" : "bg-red-50"}`}>
                  <div>
                    <span>{site.siteName}</span>
                    {site.zoneName && <span className="text-sm text-gray-500 ml-2">(소속 존: {site.zoneName})</span>}
                    {!site.active && <span className="ml-2 text-xs font-bold text-red-600 bg-red-200 px-2 py-1 rounded-full">비활성</span>}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => onEditSite(site.siteId)} className="text-sm text-white bg-cpurple disabled:bg-gray-300" disabled={!site.active}>
                      수정
                    </Button>

                    {site.active ? (
                      <Button onClick={() => onDeactivateSite(site.siteId, site.siteName)} className="text-sm bg-clpurple text-cpurple">
                        비활성화
                      </Button>
                    ) : (
                      <>
                        <Button onClick={() => onActivateSite(site.siteId, site.siteName)} className="text-sm bg-[#00baad] text-white">
                          활성화
                        </Button>
                        <Button onClick={() => onDeleteSite(site.siteId, site.siteName)} className="text-sm bg-[#ff4068] text-white">
                          영구 삭제
                        </Button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {zones.length === 0 && sites.length === 0 && <p className="text-zinc-500 text-center py-4">아직 등록된 존이나 사이트가 없습니다.</p>}
      </div>
    </div>
  );
}

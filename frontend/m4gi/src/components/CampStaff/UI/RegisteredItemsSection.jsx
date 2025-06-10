import React from "react";
import Button from "../../Common/Button";

// ★ 부모로부터 삭제 관련 핸들러 함수들을 props로 받습니다.
export default function RegisteredItemsSection({ zones = [], sites = [], onDeleteZone, onDeleteSite }) {
  return (
    <div className="p-4">
      <header className="flex flex-col gap-2 mb-4">
        <h2 className="text-xl text-cpurple">등록된 항목 확인</h2>
        <p className="text-sm text-zinc-500">현재까지 등록된 존과 사이트 목록입니다.</p>
      </header>
      
      <div className="space-y-6">
        {/* 존 목록 섹션 */}
        {zones.length > 0 && (
          <div>
            <h3 className="text-cpurple mb-2">등록된 존 ({zones.length}개)</h3>
            <ul className="space-y-2">
              {zones.map(zone => (
                <li key={zone.zoneId} className="flex justify-between items-center bg-slate-50 p-3 rounded-md">
                  <div>
                    <span className="font-medium">{zone.zoneName}</span>
                    <span className="text-sm text-gray-500 ml-2">(ID: {zone.zoneId})</span>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => alert('존 수정 기능은 준비 중입니다.')} 
                      className="text-sm text-white bg-cpurple"
                    >
                      수정
                    </Button>
                    <Button 
                      onClick={() => onDeleteZone(zone.zoneId, zone.zoneName)} 
                      className="text-sm bg-clpurple text-cpurple"
                    >
                      삭제
                    </Button>
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
              {sites.map(site => (
                <li key={site.siteId} className="flex justify-between items-center bg-slate-50 p-3 rounded-md">
                  <div>
                    <span className="font-medium">{site.siteName}</span>
                    {site.zoneName && <span className="text-sm text-gray-500 ml-2">(소속 존: {site.zoneName})</span>}
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => alert('사이트 수정 기능은 준비 중입니다.')} 
                      className="text-sm text-white bg-cpurple"
                    >
                      수정
                    </Button>
                    <Button 
                      onClick={() => onDeleteSite(site.siteId, site.siteName)} 
                      className="text-sm bg-clpurple text-cpurple"
                    >
                      삭제
                    </Button>
                  </div>
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
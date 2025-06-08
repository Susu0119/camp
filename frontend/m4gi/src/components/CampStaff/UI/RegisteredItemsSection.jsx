"use client";
import React from "react";
import CampItemList from "./CampItemList";

export default function RegisteredItemsSection() {
  const zones = [
    { zoneName: "숲존" },
    { zoneName: "계곡존" },
    { zoneName: "숲존" },
    { zoneName: "계곡존" },
  ];

  const sites = [
    { siteName: "A01", zoneName: "숲존" },
    { siteName: "A02", zoneName: "숲존" },
  ];

  return (
        <div className="space-y-6">
            <div>등록된 존</div>
            <CampItemList
                title="등록된 존"
                items={zones}
                labelKey="zoneName"
                onEdit={(item) => console.log("존 수정:", item)}
                onDelete={(item) => console.log("존 삭제:", item)}
            />

            <div>등록된 사이트</div>
            <CampItemList
                title="등록된 사이트"
                items={sites}
                labelKey="siteName"
                subLabelKey="zoneName"
                onEdit={(item) => console.log("사이트 수정:", item)}
                onDelete={(item) => console.log("사이트 삭제:", item)}
            />
        </div>
    );
}

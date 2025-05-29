import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SiteSelector = ({ zoneId, onChange }) => {
  const [sites, setSites] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!zoneId) return;

    axios.get(`/web/api/sites/byZone?zoneId=${zoneId}`)
      .then((res) => {
        setSites(res.data);
        if (res.data.length > 0) {
          setSelectedIndex(0);
          onChange(res.data[0]); // 초기 선택값 전달
        }
      })
      .catch((err) => {
        console.error("❌ 사이트 리스트 로딩 실패:", err);
        alert("사이트 정보를 불러올 수 없습니다.");
      });
  }, [zoneId, onChange]);

  const handleChange = (e) => {
    const index = parseInt(e.target.value, 10);
    setSelectedIndex(index);
    onChange(sites[index]);
  };

  return (
    <>
      <h2 className="self-stretch px-0 pt-3 pb-2 text-lg font-bold text-fuchsia-700 max-sm:text-base">
        사이트 선택
      </h2>

      <select
        value={selectedIndex}
        onChange={handleChange}
        className="p-3 w-full bg-white rounded border border-stone-300 text-base text-black max-sm:text-sm"
      >
        {sites.map((site, idx) => (
          <option key={site.siteId || idx} value={idx}>
            {site.siteName}
          </option>
        ))}
      </select>
    </>
  );
};

export default SiteSelector;

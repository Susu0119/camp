import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Header from "../../components/Common/Header";
import Footer from "../../components/Main/UI/Footer";
import FilterSection from "../../components/Main/UI/FilterSection";
import CampingCardSection from "../../components/Main/UI/CampingSearchResultCardSection";

export default function CampingSearchPage () {
  const location = useLocation();
  const [camplist, setCamplist] = useState([]);
  const [searchParams, setSearchParams] = useState(location.state?.searchParams || {});
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const [initialLoad, setInitialLoad] = useState(true); // 초기 진입 여부 관리
  const [sortOption, setSortOption] = useState("price_high");
  
  // ★ searchParams가 준비된 뒤 초기 캠핑장 목록 복구
  useEffect(() => {
    if (location.state?.searchParams) {
      setSearchParams(location.state.searchParams);
    } else {
      const queryParams = new URLSearchParams(location.search);
      setSearchParams({
        campgroundName: queryParams.get("campgroundName") || "",
        addrSigunguList: queryParams.getAll("addrSigunguList"),
        startDate: queryParams.get("startDate") || "",
        endDate: queryParams.get("endDate") || "",
        people: Number(queryParams.get("people") || 2),
        providerCode: queryParams.get("providerCode") || "",
        providerUserId: queryParams.get("providerUserId") || "",
      });
    }
    
    if (location.state?.searchResults?.length > 0) {
      setPage(1);
      setInitialLoad(false);
    } else {
      setPage(0);
    }
  }, []);
  
  // ★ 새로고침 또는 URL 접근 시 검색 조건 복구
  useEffect(() => {
    if(!initialLoad && page === 0) {
      const fetchInitialData = async () => {
        try {
          const params = new URLSearchParams();
          Object.entries(searchParams).forEach(([key, value]) => {
            if(Array.isArray(value)) {
              value.forEach(v => params.append(key, v));
            } else {
              params.append(key, value);
            }
          });
          params.append("sortOption", sortOption);
          params.append("offset", 0);
          params.append("limit", 10);

          const res = await axios.get(`/web/api/campgrounds/searchResult?${params.toString()}`);
          setCamplist(res.data);
          setPage(res.data.length === 10 ? 1 : 0);
        } catch (err) {
          console.log("초기 데이터 복구 실패", err);
        }
      };
      fetchInitialData();
    }
  }, [searchParams]);

  // ★ 정렬 기준 변경 시, 캠핑장 목록 새로 요청
  useEffect(() => {
    if (initialLoad) return;
    
    const fetchSortedData = async () => {
      try {
        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, value);
          }
        });
        params.append("sortOption", sortOption);
        params.append("offset", 0);
        params.append("limit", 10);

        const result = await axios.get(`/web/api/campgrounds/searchResult?${params.toString()}`);
        const newData = result.data;
        setCamplist(newData);
        setPage(newData.length === 10 ? 1 : 0);
      } catch (err) {
        console.error("정렬 fetch 실패", err);
      }
    };
    fetchSortedData();
  }, [sortOption]);
  
  // ★ 무한스크롤 관련 코드 - 하단 도달 시 페이지 증가
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore]);

  // 페이지 증가 시 다음 데이터 불러오기
  useEffect(() => {
    if (page === 0) return;

    const fetchMore = async () => {
      try {
        const params = new URLSearchParams();

        Object.entries(searchParams).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v)); // 배열 처리
          } else {
            params.append(key, value);
          }
        });

        params.append("sortOption", sortOption);
        params.append("offset", page * 10);
        params.append("limit", 10);

        // console.log(`🌀 무한스크롤 요청 - page ${page}, offset ${page * 10}`); // ✅ 추가
        const result = await axios.get(`/web/api/campgrounds/searchResult?${params.toString()}`);

        const newData = result.data;
        // console.log(`📦 응답된 캠핑장 수: ${newData.length}`); // ✅ 추가
        setCamplist(prev => [...prev, ...newData]); 
        if (newData.length < 10) setHasMore(false);
      } catch (err) {
        console.error("무한 스크롤 로딩 실패", err);
      }
    };
    fetchMore();
  }, [page]);

  return (
    <main>
      <section className="w-full">
        <Header />
        <div className="px-15 my-5 w-full">
          <FilterSection 
            sortOption={sortOption}
            setSortOption={setSortOption} 
          />
          <CampingCardSection campingData={camplist} />
        </div>
        <div ref={observerRef} className="h-5 mt-5" />
        <Footer />
      </section>
    </main>
  );
};


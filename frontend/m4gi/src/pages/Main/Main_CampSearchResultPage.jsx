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
  const [initialLoad, setInitialLoad] = useState(true);         // 초기 진입 여부 관리
  const [sortOption, setSortOption] = useState("price_high");
  const [blockScroll, setBlockScroll] = useState(false);        // 정렬 직후 무한스크롤 중복 실행 방지용

  const fetchCampgrounds = async (pageNumber = 0) => {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (Array.isArray(value)) value.forEach( v => params.append(key, v));
      else params.append(key, value);
    });

    params.append("sortOption", sortOption);
    params.append("offset", pageNumber * 10);
    params.append("limit", 10);

    const res = await axios.get(`/web/api/campgrounds/searchResult?${params.toString()}`);
    return res.data;
  }


  // ★ searchParams가 준비된 뒤 초기 캠핑장 목록 복구
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const restoredParams = {
      campgroundName: queryParams.get("campgroundName") || "",
      addrSigunguList: queryParams.getAll("addrSigunguList"),
      startDate: queryParams.get("startDate") || "",
      endDate: queryParams.get("endDate") || "",
      people: Number(queryParams.get("people") || 2),
      providerCode: queryParams.get("providerCode") || "",
      providerUserId: queryParams.get("providerUserId") || "",
    };
    setSearchParams(restoredParams);
    setPage(0);
    setCamplist([]);
    setInitialLoad(false);
  }, [location.search]);
  
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
          setInitialLoad(false);
        } catch (err) {
          console.log("초기 데이터 복구 실패", err);
        }
      };
      fetchInitialData();
    }
  }, [searchParams]);

  // ★ 정렬 기준 변경 시, 캠핑장 목록 새로 요청
  useEffect(() => {
    if (!searchParams || initialLoad) return;
    
    const fetchSortedData = async () => {
      setBlockScroll(true); // 스크롤 막기

      try {
        setCamplist([]);
        setPage(0);

        const data = await fetchCampgrounds(0);
        setCamplist(data);
        setPage(data.length === 10 ? 1 : 0);
        setHasMore(data.length === 10);
      } catch (err) {
        console.error("정렬 fetch 실패", err);
        setHasMore(false);
      } finally {
        setTimeout(() => setBlockScroll(false), 300); // 무한 스크롤 재허용
      }
    };
    fetchSortedData();
  }, [searchParams, sortOption]);
  
  // ★ 무한스크롤 관련 코드 - 하단 도달 시 페이지 증가
  useEffect(() => {
    if(!observerRef.current || !hasMore) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });

    const timer = setTimeout(() => {
      observer.observe(observerRef.current);
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    }
  }, [hasMore]);

  // 페이지 증가 시 다음 데이터 불러오기
  useEffect(() => {
    if (page === 0 || blockScroll || !hasMore) return;

    const loadMore = async () => {
      try {
        if (page === 0 || blockScroll) return; // 스크롤 차단

        const data = await fetchCampgrounds(page);
        setCamplist(prev => [...prev, ...data]); 
        if (data.length < 10) setHasMore(false);
      } catch (err) {
        console.error("무한 스크롤 로딩 실패", err);
      }
    };
    loadMore();
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


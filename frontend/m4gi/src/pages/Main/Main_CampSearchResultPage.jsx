import React, { useEffect, useState, useRef } from "react";
import { apiCore } from "../../utils/Auth";
import { useLocation } from "react-router-dom";
import Header from "../../components/Common/Header";
import Footer from "../../components/Main/UI/Footer";
import FilterSection from "../../components/Main/UI/FilterSection";
import CampingCardSection from "../../components/Main/UI/CampingSearchResultCardSection";

export default function CampingSearchResultPage () {
  const location = useLocation();
  const [camplist, setCamplist] = useState([]);
  const [searchParams, setSearchParams] = useState(location.state?.searchParams || {});
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const [initialLoad, setInitialLoad] = useState(true);         // 초기 진입 여부 관리
  const [sortOption, setSortOption] = useState("price_high");
  const [blockScroll, setBlockScroll] = useState(false);        // 정렬 직후 무한스크롤 중복 실행 방지용
  
  // 필터링
  const [draftFilter, setDraftFilter] = useState({
    featureList: [],
    campgroundTypes: [],
    siteEnviroments: []
  });
  
  const [appliedFilter, setAppliedFilter] = useState({
    featureList: [],
    campgroundTypes: [],
    siteEnviroments: []
  });

  const fetchCampgrounds = async (pageNumber = 0) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (Array.isArray(value)) value.forEach( v => params.append(key, v));
      else params.append(key, value);
    });
    params.append("sortOption", sortOption);
    params.append("offset", pageNumber * 12);
    params.append("limit", 12);
    appliedFilter.campgroundTypes.forEach(type => 
      params.append("campgroundTypes", type)
    );
    appliedFilter.siteEnviroments.forEach(env => 
      params.append("siteEnviroments", env)
    );
    appliedFilter.featureList.forEach(feature => 
      params.append("featureList", feature)
    );

    const res = await apiCore.get(`/api/campgrounds/searchResult?${params.toString()}`);
    return res.data;
  }

  // ★ searchParams가 준비된 뒤 초기 캠핑장 목록 복구
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const restoredParams = {
      campgroundId: queryParams.get("campgroundId") || "",
      campgroundName: queryParams.get("campgroundName") || "",
      locations: queryParams.getAll("locations"), 
      startDate: queryParams.get("startDate") || "",
      endDate: queryParams.get("endDate") || "",
      people: Number(queryParams.get("people") || 2),
    };
    setSearchParams(restoredParams);
    setPage(0);
    setCamplist([]);
    setHasMore(true);
    setInitialLoad(false);
  }, [location.search]);

  // ★ 메인 데이터 로더 : 정렬 기준 변경 시, 캠핑장 목록 새로 요청
  useEffect(() => {
    if (initialLoad) {
      return;
    }
    
    const fetchSortedData = async () => {
      setBlockScroll(true); // 스크롤 막기

      try {
        const data = await fetchCampgrounds(0);
        setCamplist(data);

        setPage(1);

        setHasMore(data.length === 12);
      } catch (err) {
        console.error("메인 데이터 로더(0번 페이지) 데이터 가져오기 실패 :", err);
        setHasMore(false);
      } finally {
        setTimeout(() => setBlockScroll(false), 300); // 무한 스크롤 재허용
      }
    };
    fetchSortedData();
  }, [searchParams, sortOption, appliedFilter, initialLoad]);
  
  // ★ 무한스크롤 관련 코드(옵저버) - 하단 도달 시 페이지 증가
  useEffect(() => {
    if (initialLoad || !observerRef.current || blockScroll || !hasMore) {
      if(observerRef.current) {
        const tempObserver = new IntersectionObserver(() => {});
        tempObserver.observe(observerRef.current); // Ensure any previous observer is disconnected
        tempObserver.disconnect();
      }
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !blockScroll && hasMore) {
        setPage(prev => prev + 1);
      }
    }, { threshold: 0.1 });

    const currentObserverRef = observerRef.current;
    observer.observe(currentObserverRef);

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      };
      observer.disconnect();
    }
  }, [initialLoad, blockScroll, hasMore]);

  // 페이지 증가 시 다음 데이터 불러오기
  useEffect(() => {
    if (initialLoad || page === 0 || blockScroll || !hasMore) {
      return;
    }

    console.log(`무한 스크롤: page가 ${page}로 변경 -> 추가 데이터 가져오기`);
    const loadMore = async () => {
      try {
        let apiData = await fetchCampgrounds(page);
        const newData = Array.isArray(apiData) ? apiData : [];

        setCamplist(prevList => {
          const existingIds = new Set(prevList.map(item => item.campgroundId));
          const uniqueNewData = newData.filter(item => !existingIds.has(item.campgroundId));
          return [...prevList, ...uniqueNewData];
        });

        setHasMore(newData.length === 12);
      } catch (err) {
        console.error("무한 스크롤 추가 데이터 로딩 실패:", err);
      }
    };
    loadMore();
  }, [page, initialLoad, blockScroll, hasMore]);

  const handleApplyFilter = () => {
    setAppliedFilter(draftFilter);
  };

  return (
    <main>
      <section className = "w-full">
        <Header />
        <div className = "px-15 my-5 w-full">
          <FilterSection 
            // 정렬
            sortOption = {sortOption}
            setSortOption = {setSortOption}
            // 필터
            draftFilter = {draftFilter}
            setDraftFilter = {setDraftFilter}
            onApplyFilter={handleApplyFilter}
            setAppliedFilter={setAppliedFilter}
            setPage={setPage}
            setCamplist={setCamplist}
            setHasMore={setHasMore}
          />
          <CampingCardSection campingData = {camplist} />
        </div>
        <div ref = {observerRef} className="h-5 mt-5" />
        <Footer />
      </section>
    </main>
  );
};


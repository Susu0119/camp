import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Header from "../../components/Common/Header";
import Footer from "../../components/Main/UI/Footer";
import FilterSection from "../../components/Main/UI/FilterSection";
import CampingCardSection from "../../components/Main/UI/CampingSearchResultCardSection";

export default function CampingSearchPage () {
  const location = useLocation();
  // 무한 스크롤 관련
  const [camplist, setCamplist] = useState(location.state?.searchResults || []);
  const [searchParams, setSearchParams] = useState(location.state?.searchParams || {});
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const [initialLoad, setInitialLoad] = useState(true); // 초기 진입 여부 관리
  // 정렬 관련
  const [sortOption, setSortOption] = useState("price_high");
  
  // ★ 정렬 관련 코드
  useEffect(() => {
    if (location.state?.searchParams) {
      setSearchParams(location.state.searchParams);
    }

    if (location.state?.searchResults?.length > 0) {
      setPage(1);
      setInitialLoad(false);
    } else {
      setPage(0);
    }
  }, []);

  useEffect(() => {
    if (initialLoad) return;

    // 테스트용
    console.log("정렬 요청 시작", sortOption); // ✅ 추가
    console.log("정렬 요청 파라미터", searchParams); // ✅ 추가

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
    // window.scrollTo({ top: 0, behavior: "smooth" });
  }, [sortOption]);
  
  // ★ 무한스크롤 관련 코드
  // 페이지 증가
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

        console.log(`🌀 무한스크롤 요청 - page ${page}, offset ${page * 10}`); // ✅ 추가
        const result = await axios.get(`/web/api/campgrounds/searchResult?${params.toString()}`);

        const newData = result.data;
        console.log(`📦 응답된 캠핑장 수: ${newData.length}`); // ✅ 추가
        setCamplist(prev => [...prev, ...newData]); // 기존 목록에 이어붙이기
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


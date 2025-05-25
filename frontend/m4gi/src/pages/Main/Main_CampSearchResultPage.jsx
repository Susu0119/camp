import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Header from "../../components/Common/Header";
import Footer from "../../components/Main/UI/Footer";
import FilterSection from "../../components/Main/UI/FilterSection";
import CampingCardSection from "../../components/Main/UI/CampingSearchResultCardSection";

export default function CampingSearchPage () {
  const location = useLocation();
  
  // ★ 무한스크롤 관련 코드
  const [camplist, setCamplist] = useState(location.state?.searchResults || []);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);

  // 최초 진입 시, 페이지를 1로 세팅
  useEffect(() => {
    if (!camplist.length) {
      setPage(1);
    }
  }, []);
  
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
        const result = await axios.get("/web/api/campgrounds/searchResult", {
          params: {
            ...location.state?.searchParams,
            offset: page * 10,
            limit: 10,
          }
        }); 
        const newData = result.data;
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
          <FilterSection />
          <CampingCardSection campingData={camplist} />
        </div>
        <div ref={observerRef} className="h-5 mt-5" />
        <Footer />
      </section>
    </main>
  );
};


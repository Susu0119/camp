import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Common/Header";
import NoticeCard from "../../components/Notice/UI/NoticeCard";
import BackButton from "../../components/Notice/UI/BackButton";

const NoticeDetailPage = () => {
  const { id } = useParams();          // /notices/:id
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/web/api/notices/${id}`)    // ← 백엔드 상세 API
      .then((res) => setNotice(res.data))
      .catch(() => alert("공지 정보를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)  return <Header />;      // 간단 로딩 처리
  if (!notice)  return <Header />;      // 오류 시 헤더만

  return (
    <div className="flex flex-col bg-white">
      <Header />
      <main className="self-center px-10 py-10 w-full max-w-[1400px]">
        <NoticeCard notice={notice} />
        <BackButton onClick={() => navigate(-1)} />
      </main>
    </div>
  );
};

export default NoticeDetailPage;

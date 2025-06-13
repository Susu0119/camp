import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Common/Header";
import Sidebar from "../../components/CS/UI/CS_Sidebar"; // ✅ 사이드바 추가
import NoticeCard from "../../components/Notice/UI/NoticeCard";
import BackButton from "../../components/Notice/UI/BackButton";

const NoticeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/web/api/notices/${id}`)
      .then((res) => setNotice(res.data))
      .catch(() => alert("공지 정보를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !notice) return <Header />; // 간단 로딩/에러 처리

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        {/* 중앙 정렬 wrapper */}
        <div className="flex flex-1 justify-center px-4 py-10">
          <main className="w-full max-w-4xl">
            <NoticeCard notice={notice} />
            <BackButton onClick={() => navigate(-1)} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetailPage;

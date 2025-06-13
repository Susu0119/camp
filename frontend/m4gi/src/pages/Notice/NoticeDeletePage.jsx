import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Common/Header";

const NoticeDeletePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const { data } = await axios.get(`/web/api/notices/${id}`);
        setNotice(data);
      } catch (err) {
        alert("공지 불러오기 실패");
      }
    };
    fetchNotice();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/web/api/notices/${id}`);
      alert("공지 삭제 완료");
      navigate("/notice");
    } catch (err) {
      alert("삭제 실패");
    }
  };

  if (!notice) return null;

  return (
    <div className="flex flex-col items-center bg-white w-full">
      <Header showSearchBar={false} />
      <div className="p-10 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">공지 삭제</h2>
        <p className="mb-2 font-semibold">제목</p>
        <div className="border p-2 mb-4">{notice.noticeTitle}</div>
        <p className="mb-2 font-semibold">내용</p>
        <div className="border p-2 mb-4 whitespace-pre-wrap">{notice.noticeContent}</div>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          삭제하기
        </button>
      </div>
    </div>
  );
};

export default NoticeDeletePage;
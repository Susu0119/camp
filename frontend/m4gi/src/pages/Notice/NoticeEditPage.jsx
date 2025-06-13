import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Common/Header";

const NoticeEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const { data } = await axios.get(`/web/api/notices/${id}`);
        setTitle(data.noticeTitle);
        setContent(data.noticeContent);
      } catch (err) {
        alert("공지 불러오기 실패");
      }
    };
    fetchNotice();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.put(`/web/api/notices/${id}`, {
        noticeTitle: title,
        noticeContent: content,
        isPublished: 1,
      });
      alert("공지 수정 완료");
      navigate("/notice");
    } catch (err) {
      alert("수정 실패");
    }
  };

  return (
    <div className="flex flex-col items-center bg-white w-full">
      <Header showSearchBar={false} />
      <div className="p-10 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">공지 수정</h2>
        <input
          type="text"
          placeholder="제목"
          className="w-full border px-4 py-2 mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="내용"
          className="w-full border px-4 py-2 h-40 mb-4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
        >
          수정하기
        </button>
      </div>
    </div>
  );
};

export default NoticeEditPage;

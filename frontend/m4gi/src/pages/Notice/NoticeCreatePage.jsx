import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/Common/Header";
import { useNavigate } from "react-router-dom";

const NoticeCreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate(); // ✅ 추가

  const handleSubmit = async () => {
    try {
      await axios.post("/web/api/notices", {
        noticeTitle: title,
        noticeContent: content,
        isPublished: 1,
      });
      alert("공지 등록 완료");
      navigate("/notice"); // ✅ 등록 성공 시 이동
    } catch (err) {
      alert("등록 실패");
    }
  };

  return (
    <div className="flex flex-col items-center bg-white w-full">
      <Header showSearchBar={false} />
      <div className="p-10 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">공지 등록</h2>
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
          onClick={handleSubmit}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          등록하기
        </button>
      </div>
    </div>
  );
};

export default NoticeCreatePage;

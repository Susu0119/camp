import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/Common/Header";
import Sidebar from "../../components/CS/UI/CS_Sidebar"; 
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const NoticeCreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await axios.post("/web/api/announcements", {
        noticeTitle: title,
        noticeContent: content,
        isPublished: 1,
      });
      await Swal.fire({
        icon: 'success',
        title: '공지 등록 완료',
        text: '공지사항이 성공적으로 등록되었습니다.',
      });
      navigate("/notice");
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: '공지 등록 실패',
        text: '서버와의 통신 중 오류가 발생했습니다.',
      });
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <Header showSearchBar={false} />

      <div className="flex flex-1">
        <Sidebar />

        {/* 중앙 정렬 및 고정 폭 컨테이너 */}
        <div className="flex flex-1 justify-center px-4 py-10">
          <main className="w-full max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">공지 등록</h2>

            <input
              type="text"
              placeholder="제목"
              className="w-full border px-4 py-2 mb-4 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="내용"
              className="w-full border px-4 py-2 h-40 mb-4 rounded"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              등록하기
            </button>
          </main>
        </div>
      </div>
    </div>
  );
};

export default NoticeCreatePage;

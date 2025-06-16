import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Common/Header";
import Sidebar from "../../components/CS/UI/CS_Sidebar";
import Swal from "sweetalert2";

const NoticeEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const { data } = await axios.get(`/web/api/announcements/${id}`);
        setTitle(data.noticeTitle);
        setContent(data.noticeContent);
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: '공지 조회 실패',
          text: '공지사항 정보를 불러올 수 없습니다.',
        });
      }
    };
    fetchNotice();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.put(`/web/api/announcements/${id}`, {
        noticeTitle: title,
        noticeContent: content,
      });
      await Swal.fire({
        icon: 'success',
        title: '수정 완료',
        text: '공지사항이 수정되었습니다.',
      });
      navigate("/notice");
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: '수정 실패',
        text: '공지사항 수정 중 오류가 발생했습니다.',
      });
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <Header showSearchBar={false} />

      <div className="flex flex-1">
        <Sidebar />

        {/* 중앙 정렬 컨테이너 */}
        <div className="flex flex-1 justify-center px-4 py-10">
          <main className="w-full max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">공지 수정</h2>

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
              onClick={handleUpdate}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              수정하기
            </button>
          </main>
        </div>
      </div>
    </div>
  );
};

export default NoticeEditPage;

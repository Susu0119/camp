import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Common/Header";
import Sidebar from "../../components/CS/UI/CS_Sidebar"; 
import Swal from "sweetalert2";

const NoticeDeletePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const { data } = await axios.get(`/web/api/announcements/${id}`);
        setNotice(data);
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: '공지 불러오기 실패',
          text: '공지사항 정보를 불러올 수 없습니다.',
        });
      }
    };
    fetchNotice();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/web/api/announcements/${id}`);
      await Swal.fire({
        icon: 'success',
        title: '삭제 완료',
        text: '공지사항이 삭제되었습니다.',
      });
      navigate("/notice");
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: '삭제 실패',
        text: '공지사항 삭제 중 오류가 발생했습니다.',
      });
    }
  };

  if (!notice) return null;

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <Header showSearchBar={false} />
      <div className="flex flex-1">
        <Sidebar />

        {/* 중앙 정렬 wrapper */}
        <div className="flex flex-1 justify-center px-4 py-10">
          <main className="w-full max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">공지 삭제</h2>

            <p className="mb-2 font-semibold">제목</p>
            <div className="border p-2 mb-4 rounded bg-gray-50">{notice.noticeTitle}</div>

            <p className="mb-2 font-semibold">내용</p>
            <div className="border p-2 mb-6 whitespace-pre-wrap rounded bg-gray-50">
              {notice.noticeContent}
            </div>

            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              삭제하기
            </button>
          </main>
        </div>
      </div>
    </div>
  );
};

export default NoticeDeletePage;

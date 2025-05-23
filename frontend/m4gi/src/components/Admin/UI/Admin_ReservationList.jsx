import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./AdminSidebar";

const getStateColor = (state) => {
  switch (state) {
    case "환불완료": return "text-blue-600";
    case "환불거부": return "text-gray-500";
    case "환불대기": return "text-red-500";
    default: return "";
  }
};

// 날짜 포맷 함수
const formatDate = (raw) => {
  if (!raw) return "";

  const str = String(raw).replace(/[^\d]/g, "").padStart(7, "0");
  const year = str.slice(0, 4);
  const month = str.slice(4, 5).padStart(2, "0");
  const day = str.slice(5, 7).padStart(2, "0");

  return `${year}-${month}-${day}`;
};



export default function AdminReservationList() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    axios.get("/web/admin/reservations")
      .then((res) => setReservations(res.data))
      .catch((err) => {
        console.error("❌ 예약 목록 가져오기 실패:", err);
      });
  }, []);

  return (
    <div className="h-screen bg-gray-10 flex select-none">
      <Sidebar />

      <main className="flex-1 p-6 max-w-6xl mx-auto">
        <h2 className="text-4xl text-purple-900/70 mt-4 mb-6">예약 목록</h2>

        {/* 필터 */}
        <div className="mb-6 p-4 text-black/70 border border-gray-200 shadow-sm rounded-xl bg-white flex flex-wrap justify-end gap-6">
          <input type="date" className="px-4 py-2 focus:outline-none border border-gray-200 rounded-xl" />
          <select className="px-4 py-2 focus:outline-none border rounded-xl border-gray-200">
            <option value="">전체</option>
            <option value="예약완료">예약완료</option>
            <option value="환불대기">환불대기</option>
            <option value="환불완료">환불완료</option>
            <option value="환불거부">환불거부</option>
          </select>
          <select className="px-4 py-2 rounded-xl focus:outline-none border border-gray-200">
            <option value="recent">최근 등록순</option>
            <option value="old">오래된 순</option>
          </select>
          <input type="text" placeholder="예약자명 검색" className="bg-purple-200/60 px-4 py-1 rounded-xl w-60 focus:outline-none" />
        </div>

        {/* 테이블 */}
        <div className="overflow-hidden rounded-xl shadow-sm border border-gray-200">
          <table className="w-full border-collapse text-lg text-black/80">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b border-gray-200 px-4 py-2">예약자</th>
                <th className="border-b border-gray-200 px-4 py-2">캠핑장</th>
                <th className="border-b border-gray-200 px-4 py-2">입실일</th>
                <th className="border-b border-gray-200 px-4 py-2">예약상태</th>
                <th className="px-4 py-2">환불상태</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-4">예약 정보가 없습니다.</td>
                </tr>
              ) : (
                reservations.map((item, idx) => (
                  <tr key={idx} className="text-center">
                    <td className="border-b border-gray-300 px-4 py-2">{item.userNickname}</td>
                    <td className="border-b border-gray-300 px-4 py-2">{item.campgroundName}</td>
                    <td className="border-b border-gray-300 px-4 py-2">{formatDate(item.checkinDate)}</td>
                    <td className="border-b border-gray-300 px-4 py-2">{item.reservationStatus}</td>
                    <td className={`border-b border-gray-300 px-4 py-2 font-semibold ${getStateColor(item.refundStatus)}`}>
                      {item.refundStatus}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

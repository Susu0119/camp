import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Admin_Sidebar";
import AdminCampgroundModal from "./Admin_CampgroundModal";

export default function AdminCampgroundList() {
  const itemsPerPage = 14;
  const [campgrounds, setCampgrounds] = useState([]);
  const [filteredCampgrounds, setFilteredCampgrounds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [keyword, setKeyword] = useState("");

  const fetchCampgrounds = async (params = {}) => {
    try {
      const filteredParams = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== ""));
      const res = await axios.get("/web/admin/campgrounds/search", { params: filteredParams });
      const data = Array.isArray(res.data) ? res.data : res.data.campgrounds || [];
      setCampgrounds(data);
      setFilteredCampgrounds(data);
      setCurrentPage(1);
    } catch (err) {
      console.error("❌ 캠핑장 목록 불러오기 실패:", err);
      alert("데이터 불러오기 실패");
      setFilteredCampgrounds([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCampgrounds({ status, sortOrder, keyword });
  };

  const resetFilters = () => {
    setStatus("");
    setSortOrder("DESC");
    setKeyword("");
    fetchCampgrounds({ sortOrder: "DESC" });
  };

  const handleRowClick = async (id) => {
    try {
      const res = await axios.get(`/web/admin/campgrounds/${id}/detail`);
      setSelectedDetail({ ...res.data, status: Number(res.data.status) });
      setModalOpen(true);
    } catch (err) {
      alert("❌ 상세정보 불러오기 실패");
    }
  };

  useEffect(() => {
    fetchCampgrounds({ sortOrder: "DESC" });
  }, []);

  const paginatedCampgrounds = filteredCampgrounds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(filteredCampgrounds.length / itemsPerPage));

  const getStatusLabel = (s) => {
  switch (Number(s)) {
    case 0: return <span className="text-green-500">운영중</span>;
    case 1: return <span className="text-yellow-500">휴무중</span>;
    case 2: return <span className="text-gray-400">비활성화</span>;
    default: return <span className="text-red-400">알 수 없음</span>;
  }
};

  return (
    <div className="min-h-screen bg-gray-10 flex select-none">
      <Sidebar />
      <main className="flex-1 px-8 py-6 max-w-screen-2xl mx-auto">
        <h1 className="text-4xl text-purple-900/70 mt-4 mb-6">캠핑장 목록</h1>
        <form onSubmit={handleSearch} className="mb-6 p-4 text-black/70 border border-gray-200 shadow-sm rounded-xl flex flex-col gap-4">
        <div className="flex flex-wrap justify-end gap-4">
          <select 
          value={sortOrder} 
          onChange={(e) => {
            const value = e.target.value;
            setSortOrder(value);
            console.log("🔄 정렬 드롭다운 선택:", value);
            setSortOrder(value);
            fetchCampgrounds({ status, keyword, sortOrder: value });
          }}
          className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none">
            <option value="DESC">최신 등록순</option>
            <option value="ASC">오래된 순</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none">
            <option value="">전체 상태</option>
            <option value="운영중">운영중</option>
            <option value="휴무중">휴무중</option>
            <option value="비활성화">비활성화</option>
          </select>
        </div>

        <div className="flex justify-end gap-4">
          <input type="text" name="keyword" placeholder="캠핑장명 or 주소 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="bg-purple-300/30 px-4 py-1 rounded-xl w-60 focus:outline-none shadow-sm" />
          <button type="submit" className="bg-purple-900/80 hover:bg-purple-900/90 text-white px-6 py-2 rounded-lg shadow-sm cursor-pointer">검색</button>
          <button type="button" onClick={resetFilters} className="bg-gray-400/50 hover:bg-gray-400/80 text-black/70 px-4 py-2 rounded-lg shadow-sm cursor-pointer">초기화</button>
        </div>
        </form>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
          <table className="w-full border-collapse text-lg text-black/80">
            <thead className="bg-gray-100">
              <tr>
                <th className="border-b border-gray-200 px-6 py-3 text-center">캠핑장명</th>
                <th className="border-b border-gray-200 px-6 py-3 text-center">주소</th>
                <th className="border-b border-gray-200 px-6 py-3 text-center">전화번호</th>
                <th className="border-b border-gray-200 px-6 py-3 text-center">상태</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCampgrounds.length === 0 ? (
                <tr><td colSpan="4" className="text-center text-gray-400 py-4">캠핑장 정보가 없습니다.</td></tr>
              ) : (
                paginatedCampgrounds.map((camp, i) => (
                  <tr key={i} onClick={() => handleRowClick(camp.id)} className="hover:bg-purple-100 cursor-pointer transition">
                    <td className="border-b border-gray-300 px-8 py-4 whitespace-nowrap text-center">{camp.name}</td>
                    <td className="border-b border-gray-300 px-8 py-4 whitespace-nowrap text-center">{camp.roadAddress}</td>
                    <td className="border-b border-gray-300 px-8 py-4 whitespace-nowrap text-center">{camp.phone}</td>
                    <td className="border-b border-gray-300 px-8 py-4 whitespace-nowrap text-center">{getStatusLabel(camp.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6 gap-2 text-lg">
          <button className="cursor-pointer text-purple-900/70" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>{'<<'}</button>
          <button className="cursor-pointer text-purple-900/70" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>{'<'}</button>
          {[...Array(totalPages).keys()].map(i => (
            <button key={i} onClick={() => setCurrentPage(i + 1)} className={`h-9 w-9 flex items-center justify-center rounded-full cursor-pointer transition text-purple-900/70 ${currentPage === i + 1 ? 'bg-purple-100 text-purple-900/70' : 'hover:bg-purple-100 hover:shadow-sm'}`}>{i + 1}</button>
          ))}
          <button className="cursor-pointer text-purple-900/70" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>{'>'}</button>
          <button className="cursor-pointer text-purple-900/70" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>{'>>'}</button>
        </div>

        {modalOpen && selectedDetail && (
          <AdminCampgroundModal
            key={selectedDetail?.id}
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setSelectedId(null);
              setSelectedDetail(null);
            }}
            detail={selectedDetail}
            refreshList={() => fetchCampgrounds({ status, keyword, sortOrder })}
          />
        )}
      </main>
    </div>
  );
}

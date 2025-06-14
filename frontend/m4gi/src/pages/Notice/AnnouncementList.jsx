import { useAuth } from '../../utils/Auth';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Common/Header";
import Sidebar from "../../components/CS/UI/CS_Sidebar"; // ✅ 추가
import SearchSection from "../../components/Notice/UI/SearchSection";
import AnnouncementTable from "../../components/Notice/UI/AnnouncementTable";
import Pagination from "../../components/Admin/UI/Admin_Pagination";

const PAGE_SIZE = 10;

const AnnouncementList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notices, setNotices] = useState([]);

  const fetchNotices = async (page = 1, kw = "") => {
    try {
      const { data } = await axios.get("/web/api/notices/page", {
        params: { page, size: PAGE_SIZE, keyword: kw || undefined },
      });
      setNotices(data.notices);
      setTotalPages(Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)));
    } catch (e) {
      console.error("공지 조회 실패", e);
      setNotices([]);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSearch = (kw) => {
    setKeyword(kw);
    setCurrentPage(1);
    fetchNotices(1, kw);
  };

  const handlePage = (p) => {
    setCurrentPage(p);
    fetchNotices(p, keyword);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <Header showSearchBar={false} />
      <div className="flex flex-1">
        <Sidebar /> {/* ✅ 사이드바 추가 */}
        <div className="flex flex-1 justify-center px-4 py-10">
        <main className="flex flex-col gap-4 w-full max-w-5xl px-6 py-10">
          <h1 className="text-3xl font-bold">공지사항</h1>

          <SearchSection onSearch={handleSearch} />

          <AnnouncementTable 
            notices={notices} 
            isAdmin={user?.userRole >= 3} 
            onEdit={(id) => navigate(`/notice/edit/${id}`)}
            onDelete={(id) => navigate(`/notice/delete/${id}`)}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={handlePage}
            />
          )}

          {user?.userRole >= 3 && (
            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => navigate("/notice/new")}
                className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700"
              >
                공지 등록
              </button>
            </div>
          )}
        </main>
      </div>
      </div>
    </div>
  );
};

export default AnnouncementList;

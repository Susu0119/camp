import { NavLink, Link } from "react-router-dom";
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import HolidayVillageOutlinedIcon from '@mui/icons-material/HolidayVillageOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';

// [수정] 메뉴 항목에 아이콘 및 그룹 추가
const menuGroups = [
  {
    title: "관리",
    items: [
      { name: "대시보드", path: "/admin/dashboard", icon: <DashboardCustomizeOutlinedIcon /> },
      { name: "예약 관리", path: "/admin/reservations", icon: <CalendarMonthOutlinedIcon /> },
      { name: "사용자 관리", path: "/admin/users", icon: <GroupOutlinedIcon /> },
      { name: "캠핑장 관리", path: "/admin/campgrounds", icon: <HolidayVillageOutlinedIcon /> },
    ],
  },
  {
    title: "콘텐츠 & 지원",
    items: [
      { name: "리뷰 신고 관리", path: "/admin/reports", icon: <FlagOutlinedIcon /> },
      { name: "결제 관리", path: "/admin/payments", icon: <PaymentOutlinedIcon /> },
      { name: "문의/고객센터 관리", path: "/admin/cs", icon: <SupportAgentOutlinedIcon /> },
      { name: "공지사항/이벤트 관리", path: "/admin/notices", icon: <CampaignOutlinedIcon /> },
    ],
  },
];

function Sidebar() {
  // [수정] 전체 구조를 단일 fixed aside로 변경
  return (
    <aside className="w-72 bg-slate-800 text-white flex flex-col min-h-screen fixed top-0 left-0 z-20">
      {/* 로고 섹션 */}
      <div className="h-24 flex items-center justify-center border-b border-slate-700">
        <h1 className="text-4xl font-bold text-white/90" style={{ fontFamily: 'GapyeongWave' }}>
          <Link to="/admin/dashboard">Campia</Link>
        </h1>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 px-4 py-6 space-y-6">
        {menuGroups.map((group) => (
          <div key={group.title}>
            {/* 메뉴 그룹 제목 */}
            <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center w-full p-3 rounded-lg transition-colors duration-150
                    ${isActive
                      ? "bg-purple-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`
                  }
                >
                  <span className="mr-3 w-6 h-6 flex items-center justify-center">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* 사이드바 하단 (예: 로그아웃 버튼 등) */}
      <div className="p-4 border-t border-slate-700">
        {/* 추후 유저 정보나 로그아웃 버튼을 추가할 수 있는 공간입니다. */}
      </div>
    </aside>
  );
}

export default Sidebar;
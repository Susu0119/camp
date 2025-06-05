import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "대시보드", path: "/admin/dashboard" },
  { name: "예약 관리", path: "/admin/reservations" },
  { name: "사용자 관리", path: "/admin/users" },
  { name: "캠핑장 관리", path: "/admin/campgrounds" },
  { name: "리뷰 신고 관리", path: "/admin/reports" },
  { name: "결제 관리", path: "/admin/payments" },
  { name: "문의/고객센터 관리", path: "/admin/cs" },
  { name: "공지사항/이벤트 관리", path: "/admin/notices" }
];

export default function AdminSidebar() {
  return (
    <aside className="w-96 min-h-screen bg-transparent bg-gradient-to-b from-purple-900 to-purple-800/60 p-6 flex flex-col pt-15">
      
      {/* Campia 중앙 정렬 유지 */}
      <h3 className="text-6xl font-bold text-center text-white/80 mb-20" style={{ fontFamily: 'GapyeongWave' }}>
        Campia
      </h3>

      {/* 메뉴 왼쪽 정렬 */}
      <nav className="flex flex-col space-y-4 w-full text-2xl text-purple-300 mt-10 pl-4 pr-4">
        {menuItems.map((item, i) => (
          <div key={i} className="w-full flex flex-col gap-3 items-start">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `w-full py-3 px-5 text-left leading-none flex items-center rounded-full transition duration-150 cursor-pointer
                 ${isActive 
                   ? "bg-purple-400/50 text-black/60 font-semibold"
                   : "hover:bg-purple-400/50 hover:text-black/60"}`
              }
            >
              {item.name}
            </NavLink>
            {i !== menuItems.length - 1 && <hr className="border-purple-300/30 border-t-2 w-full" />}
          </div>
        ))}
      </nav>
    </aside>
  );
}

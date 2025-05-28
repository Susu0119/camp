// src/routes.js
import AdminUserList from "./components/Admin/UI/Admin_UserList";
import AdminSidebar from './components/Admin/UI/Admin_Sidebar';
import AdminReservationList from './components/Admin/UI/Admin_ReservationList';
import AdminReservationModal from './components/Admin/UI/Admin_ReservationModal';
import AdminCampgroundList from './components/Admin/UI/Admin_CampgroundList';

const routeList = [
  { path: '/admin/users', element: <AdminUserList /> },
  { path: '/admin/reservations', element: <AdminReservationList /> },
  { path: '/admin/sidebar', element: <AdminSidebar /> },
  { path: '/admin/campgrounds', element: <AdminCampgroundList /> },

  // dev 브랜치에서 추가된 fallback route
  { path: '*', element: <h1>404 - 페이지를 찾을 수 없습니다</h1> },
];

export default routeList;

// src/routes.js
import AdminUserList from "./components/Admin/UI/Admin_UserList";
import AdminSidebar from './components/Admin/UI/Admin_Sidebar';
import AdminReservationList from './components/Admin/UI/Admin_ReservationList';
import AdminCampgroundList from "./components/Admin/UI/Admin_CampgroundList";
import AdminReportList from "./components/Admin/UI/Admin_ReportList";
import AdminPaymentList from "./components/Admin/UI/Admin_PaymentList";
import AdminNoticePage from "./components/Admin/UI/Admin_NoticePage";
import AdminSupportPage from "./components/Admin/UI/Admin_SupportPage";
import LoginMainPage from "./pages/Login/Login_MainPage";
import LoginKakaoCallback from "./pages/Login/Login_KakaoCallback";
import LoginCheckAccountInfoPage from "./pages/Login/Login_CheckAccountInfoPage";
const routeList = [
  { path: '/admin/users', element: <AdminUserList /> },
  { path: '/admin/reservations', element: <AdminReservationList /> },
  { path: '/admin/sidebar', element: <AdminSidebar /> },
  { path: '/admin/campgrounds', element: <AdminCampgroundList /> },
  { path: '/admin/reports', element: <AdminReportList /> },
  { path: '/admin/payments', element: <AdminPaymentList /> },
  { path: "/admin/notices", element: <AdminNoticePage />},
  { path: "/admin/cs", element: <AdminSupportPage />},
  { path: '/', element: <LoginMainPage /> },
  { path: '/oauth/kakao/callback', element: <LoginKakaoCallback /> },
  { path: '/phone-input', element: <LoginCheckAccountInfoPage /> },

  //404 fallback
  //{ path: '*', element: <h1>404 - 페이지를 찾을 수 없습니다</h1> },
];

export default routeList;
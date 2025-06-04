import MainCampSearchPage from "./pages/Main/Main_CampSearchPage";
import MainCampSearchResultPage from "./pages/Main/Main_CampSearchResultPage";
import CampDetailPage from "./pages/Indev/CampDetailPage";
import CampZoneDetailPage from "./pages/Indev/CampZoneDetailPage";
import ReservationDashboard from "./pages/CampStaff/ReservationDashboardPage";
import AdminUserList from "./components/Admin/UI/Admin_UserList";
import AdminSidebar from './components/Admin/UI/Admin_Sidebar';
import AdminReservationList from './components/Admin/UI/Admin_ReservationList';
import AdminCampgroundList from "./components/Admin/UI/Admin_CampgroundList";
import AdminReportList from "./components/Admin/UI/Admin_ReportList";
import AdminPaymentList from "./components/Admin/UI/Admin_PaymentList";
import AdminNoticePage from "./components/Admin/UI/Admin_NoticePage";
import AdminSupportPage from "./components/Admin/UI/Admin_SupportPage";
import AdminDashboard from "./components/Admin/UI/Admin_Dashboard";
import LoginMainPage from "./pages/Login/Login_MainPage";
import LoginKakaoCallback from "./pages/Login/Login_KakaoCallback";
import LoginCheckAccountInfoPage from "./pages/Login/Login_CheckAccountInfoPage";
import MyPageMain from "./pages/MyPage/MyPage_Main";
import MyPageReservations from "./pages/MyPage/MyPage_reservations";
import MyPageCancel from "./pages/MyPage/MyPage_cancel";

import DeleteAccountPage from "./pages/MyPage/DeleteAccountPage";
import MainPage from "./pages/Main/MainPage";

const routeList = [
  { path: '/admin/users', element: <AdminUserList /> },
  { path: '/admin/reservations', element: <AdminReservationList /> },
  { path: '/admin/sidebar', element: <AdminSidebar /> },
  { path: '/admin/campgrounds', element: <AdminCampgroundList /> },
  { path: '/admin/reports', element: <AdminReportList /> },
  { path: '/admin/payments', element: <AdminPaymentList /> },
  { path: "/admin/notices", element: <AdminNoticePage />},
  { path: "/admin/cs", element: <AdminSupportPage />},
  { path: "/admin/dashboard", element: <AdminDashboard />},
  { path: '/', element: <LoginMainPage /> },
  { path: '/login', element: <LoginMainPage /> },

  { path: '/oauth/kakao/callback', element: <LoginKakaoCallback /> },
  { path: '/phone-input', element: <LoginCheckAccountInfoPage /> },
  { path: '/main', element: <MainPage /> },
  { path: '/search', element: <MainCampSearchPage /> },
  { path: '/searchResult', element: <MainCampSearchResultPage /> },
  { path: '/detail/:campgroundId', element: <CampDetailPage/>},
  { path: '/detail/:campgroundId/:zoneId', element: <CampZoneDetailPage/>},
  { path: '/reservationDashboard', element: <ReservationDashboard/>},

  {path: '/mypage/main',element:<MyPageMain/>},
  {path: '/mypage/reservations', element:<MyPageReservations/>},
  {path: '/mypage/cancel', element:<MyPageCancel/>},
  { path: '/delete', element: <DeleteAccountPage /> },
  { path: '/main', element: <MainPage /> },

  //404 fallback
  //{ path: '*', element: <h1>404 - 페이지를 찾을 수 없습니다</h1> },
];

export default routeList;

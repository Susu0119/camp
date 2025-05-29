import MainCampSearchPage from "./pages/Main/Main_CampSearchPage";
import MainCampSearchResultPage from "./pages/Main/Main_CampSearchResultPage";
import CampDetailPage from "./pages/Indev/CampDetailPage";
import ReservationDashboard from "./pages/CampStaff/ReservationDashboardPage";
import AdminUserList from "./components/Admin/UI/Admin_UserList";
import AdminSidebar from './components/Admin/UI/Admin_Sidebar';
import AdminReservationList from './components/Admin/UI/Admin_ReservationList';
import AdminReservationModal from './components/Admin/UI/Admin_ReservationModal';
import AdminCampgroundList from './components/Admin/UI/Admin_CampgroundList';
import LoginMainPage from "./pages/Login/Login_MainPage";
import LoginKakaoCallback from "./pages/Login/Login_KakaoCallback";
import LoginCheckAccountInfoPage from "./pages/Login/Login_CheckAccountInfoPage";
import TestPage from "./pages/MyPage/TestPage";
import { element } from "prop-types";
const routeList = [
  { path: '/admin/users', element: <AdminUserList /> },
  { path: '/admin/reservations', element: <AdminReservationList /> },
  { path: '/admin/sidebar', element: <AdminSidebar /> },
  { path: '/admin/campgrounds', element: <AdminCampgroundList /> },
  { path: '/', element: <LoginMainPage /> },
  { path: '/oauth/kakao/callback', element: <LoginKakaoCallback /> },
  { path: '/phone-input', element: <LoginCheckAccountInfoPage /> },
  { path: '/search', element: <MainCampSearchPage /> },
  { path: '/searchResult', element: <MainCampSearchResultPage /> },
  { path: '/detail', element: <CampDetailPage/>},
  { path: '/reservationDashboard', element: <ReservationDashboard/>},
  {path: '/test',element:<TestPage/>},
   
  //404 fallback
  //{ path: '*', element: <h1>404 - 페이지를 찾을 수 없습니다</h1> },
];

export default routeList;

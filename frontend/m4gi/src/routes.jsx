// src/routes.js
import AdminUserList from "./components/Admin/UI/Admin_UserList";
import AdminSidebar from './components/Admin/UI/Admin_Sidebar';
import AdminReservationList from './components/Admin/UI/Admin_ReservationList';
import AdminReservationModal from './components/Admin/UI/Admin_ReservationModal';
import AdminUserModal from './components/Admin/UI/Admin_UserModal';
//import CS_Main from './components/CS/CS_Main';
//import CustomerSupport from './components/CS/CS_Main';
import LoginPage from './components/CS/LoginPage';
import FindPage from './components/CS/FindPage';
import CampingSiteCard from './components/Main/Card';
import MainPage from './components/Main/Main';
import SignupPage from './components/CS/SignupPage';
import AccountStatusPage from './components/CS/AccountStatusPage';
import NonMemberPage from './components/CS/NonMemberPage';
import CampSearchPage from './components/SearchRelatedPage/CampSearchPage';
import GeminiTest from './components/Test/gemini';

const routeList = [
  { path: '/admin/users', element: <AdminUserList /> },
  { path: '/admin/reservations', element: <AdminReservationList /> },
  { path: '/admin/sidebar', element: <AdminSidebar /> },
  { path: '/test/cs', element: <CS_Main /> },
  { path: '/', element: <MainPage /> }, // 또는 CampingSiteCard로 변경 가능
  { path: '/login', element: <LoginPage /> },
  { path: '/find', element: <FindPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/account', element: <AccountStatusPage /> },
  { path: '/nonmember', element: <NonMemberPage /> },
  { path: '/search', element: <CampSearchPage /> },

  // dev 브랜치에서 추가된 fallback route
  { path: '*', element: <h1>404 - 페이지를 찾을 수 없습니다</h1> },
];

export default routeList;

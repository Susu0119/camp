// src/routes.js
import CS_Main from './components/CS/CS_Main';
import AdminReservationList from './components/Admin/AdminReservationList';
import CustomerSupport from './components/CS/CS_Main';
import LoginPage from './components/Login/LoginPage';
import FindPage from './components/Login/FindPage';
import CampingSiteCard from './components/Main/Card';
import MainPage from './components/Main/Main';
import SignupPage from './components/Login/SignupPage';
import AccountStatusPage from './components/Login/AccountStatusPage';
import NonMemberPage from './components/Login/NonMemberPage';
import CampSearchPage from './components/SearchRelatedPage/CampSearchPage';
import AdminUserList from "./components/Admin/AdminUserList";
import AdminDashboard from './components/Admin/AdminDashboard';
import GeminiTest from './components/Test/gemini';

const routeList = [
  { path: '/test/gemini', element: <GeminiTest /> },
  { path: '/test/admin-reservation', element: <AdminReservationList /> },
  { path: '/admin', element: <AdminReservationList /> },
  { path: '/admin/test', element: <AdminUserList /> },
  { path: '/admin/users', element: <AdminDashboard /> },
  { path: '/test/cs', element: <CS_Main /> },
  { path: '/', element: <MainPage /> }, // 또는 CampingSiteCard로 변경 가능
  { path: '/login', element: <LoginPage /> },
  { path: '/find', element: <FindPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/account', element: <AccountStatusPage /> },
  { path: '/nonmember', element: <NonMemberPage /> },
  { path: '/search', element: <CampSearchPage /> },

  // 404 fallback
  // { path: '*', element: <h1>404 - 페이지를 찾을 수 없습니다</h1> },
];

export default routeList;

// src/routes.js
import CS_Main from './components/CS/CS_Main';
import AdminReservationList from './components/Admin/AdminReservationList';
import CustomerSupport from './components/CS/CS_Main';
import { LoginPage } from './components/CS/LoginPage';
import FindAccount from './components/CS/FindAccount';
import CampingSiteCard from './components/Main/Card';
import MainPage from './components/Main/Main';

const routeList = [
  { path: '/test/admin-reservation', element: <AdminReservationList /> },
  { path: '/admin', element: <AdminReservationList /> },
  { path: '/test/cs', element: <CS_Main /> },
  { path: '/', element: <MainPage /> }, // 또는 CampingSiteCard로 변경 가능
  { path: '/login', element: <LoginPage /> },
  { path: '/find', element: <FindAccount /> },

  // 404 fallback
  // { path: '*', element: <h1>404 - 페이지를 찾을 수 없습니다</h1> },
];

export default routeList;

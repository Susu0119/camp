// src/routes.js
import CS_Main from './components/CS/CS_Main';
import AdminReservationList from './components/Admin/AdminReservationList';
import CampingSiteCard from './components/Main/Card';
const routeList = [

  { path: '/test/admin-reservation', element: <AdminReservationList /> },
  { path: '/admin', element: <AdminReservationList /> },
  { path: '/test/cs', element: <CS_Main /> },
  //{ path: '/', element: <CampingSiteCard /> },

  // 404 fallback
  //{ path: '*', element: <h1>404 - 페이지를 찾을 수 없습니다</h1> },
];

export default routeList;

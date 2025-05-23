import ReservationPage from "./pages/Reservation/ReservationPage";

const routeList = [

  { path: '/reservation', element: <ReservationPage /> },

  //404 fallback
  { path: '*', element: <h1>404 - 페이지를 찾을 수 없습니다</h1> },
];

export default routeList;

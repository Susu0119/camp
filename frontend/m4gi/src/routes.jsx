import MainCampSearchPage from "./pages/Main/Main_CampSearchPage";
import MainCampSearchResultPage from "./pages/Main/Main_CampSearchResultPage";
import CampDetailPage from "./pages/Indev/CampDetailPage";
import ReservationDashboard from "./pages/CampStaff/ReservationDashboardPage";

// src/routes.js

const routeList = [

  { path: '/search', element: <MainCampSearchPage /> },
  { path: '/searchResult', element: <MainCampSearchResultPage /> },
  { path: '/detail', element: <CampDetailPage/>},
  { path: '/reservationDashboard', element: <ReservationDashboard/>},
  //404 fallback
  { path: '*', element: <h1>404 - 페이지를 찾을 수 없습니다</h1> },
];

export default routeList;

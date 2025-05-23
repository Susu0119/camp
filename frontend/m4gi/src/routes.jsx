import MainCampSearchPage from "./pages/Main/Main_CampSearchPage";
import CampDetailPage from "./pages/Indev/CampDetailPage";

// src/routes.js

const routeList = [

  { path: '/search', element: <MainCampSearchPage /> },
  { path: '/detail', element: <CampDetailPage/>},
  //404 fallback
  { path: '*', element: <h1>404 - 페이지를 찾을 수 없습니다</h1> },
];

export default routeList;

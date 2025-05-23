import CampSearchPage from './pages/Main/Main_CampSearchPage'

const routeList = [
  { path: '/search', element: <CampSearchPage /> },
  //404 fallback
  { path: '*', element: <h1>404 - 페이지를 찾을 수 없습니다</h1> },
];

export default routeList;

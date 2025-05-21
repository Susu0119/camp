import CS_Main from './components/CS/CS_Main';
import AdminReservationList from './components/Admin/AdminReservationList';
import CustomerSupport from './components/CS/CS_Main';
import LoginPage from './components/Login/LoginPage';
import FindPage from './components/Login/FindPage';
import CampingSiteCard from './components/Main/Card';
import MainPage from './components/Main/Main';
import SignupPage from './components/Login/SignupPage';
import AccountStatusPage from './components/CS/AccountStatusPage';
import NonMemberPage from './components/Login/NonMemberPage';
import CampSearchPage from './components/SearchRelatedPage/CampSearchPage';
import AdminUserList from "./components/Admin/AdminUserList";
import AdminDashboard from './components/Admin/AdminDashboard';
import GeminiTest from './components/Test/gemini';

const routeList = [

  //404 fallback
  { path: '*', element: <h1>404 - 페이지를 찾을 수 없습니다</h1> },
];

export default routeList;

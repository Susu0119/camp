import ReservationPage from "./pages/Reservation/ReservationPage";
import MainCampSearchPage from "./pages/Main/Main_CampSearchPage";
import MainCampSearchResultPage from "./pages/Main/Main_CampSearchResultPage";
import CampDetailPage from "./pages/Indev/CampDetailPage";
import CampZoneDetailPage from "./pages/Indev/CampZoneDetailPage";
import AdminUserList from "./components/Admin/UI/Admin_UserList";
import AdminReservationList from "./components/Admin/UI/Admin_ReservationList";
import AdminCampgroundList from "./components/Admin/UI/Admin_CampgroundList";
import AdminReportList from "./components/Admin/UI/Admin_ReportList";
import AdminPaymentList from "./components/Admin/UI/Admin_PaymentList";
import AdminNoticePage from "./components/Admin/UI/Admin_NoticePage";
import AdminSupportPage from "./components/Admin/UI/Admin_SupportPage";
import AdminDashboard from "./components/Admin/UI/Admin_Dashboard";
import LoginMainPage from "./pages/Login/Login_MainPage";
import LoginKakaoCallback from "./pages/Login/Login_KakaoCallback";
import LoginCheckAccountInfoPage from "./pages/Login/Login_CheckAccountInfoPage";
import MyPageMain from "./pages/MyPage/MyPage_Main";
import MyPageReservations from "./pages/MyPage/MyPage_reservations";
import MyPageCancel from "./pages/MyPage/MyPage_cancel";
import MyPageProfilePage from "./pages/MyPage/MyPage_Profile";
import DeleteAccountPage from "./pages/MyPage/DeleteAccountPage";
import ReservationDashboardPage from "./pages/CampStaff/ReservationDashboardPage";
import RegistCampgroundPage from "./pages/CampStaff/RegistCampgroundPage";
import MainPage from "./pages/Main/MainPage";
import ReviewWritePage from "./pages/MyPage/MyPage_Review_WritePage";
import ReviewFindPage from "./pages/MyPage/MyPage_ReviewFind_Page";
import PaymentPage from "./pages/Payment/PaymentPage";
import CSMainPage from "./pages/CS/CS_MainPage";
import CSLostReportPage from "./pages/CS/CS_LostReportPage";
import CSPaymentForm from "./pages/CS/CS_PaymentPage";
import ChecklistPage from "./pages/MyPage/MyPage_CheckList";
import Sender from "./pages/Test/Sender";
import TestLoginPage from "./pages/Test/TestLoginPage";
import NaverMap from "./utils/NaverMap";

const routeList = [
  { path: "/notification-test", element: <Sender /> },
  { path: "/admin/users", element: <AdminUserList /> },
  { path: "/admin/reservations", element: <AdminReservationList /> },
  { path: "/admin/campgrounds", element: <AdminCampgroundList /> },
  { path: "/admin/reports", element: <AdminReportList /> },
  { path: "/admin/payments", element: <AdminPaymentList /> },
  { path: "/admin/notices", element: <AdminNoticePage /> },
  { path: "/admin/cs", element: <AdminSupportPage /> },
  { path: "/admin/dashboard", element: <AdminDashboard /> },
  { path: "/hidden", element: <Sender /> },
  { path: "/map", element: <NaverMap /> },

  { path: '/login', element: <LoginMainPage /> },
  { path: '/test-login', element: <TestLoginPage /> },
  { path: '/', element: <MainPage /> },

  { path: '/oauth/kakao/callback', element: <LoginKakaoCallback /> },
  { path: '/phone-input', element: <LoginCheckAccountInfoPage /> },
  { path: '/main', element: <MainPage /> },
  { path: '/search', element: <MainCampSearchPage /> },
  { path: '/searchResult', element: <MainCampSearchResultPage /> },

  { path: '/detail/:campgroundId', element: <CampDetailPage /> },
  { path: '/detail/:campgroundId/:zoneId', element: <CampZoneDetailPage /> },
  { path: '/staff/reservation', element: <ReservationDashboardPage /> },
  { path: "/staff/register", element: <RegistCampgroundPage /> },

  { path: '/mypage/main', element: <MyPageMain /> },
  { path: '/mypage/reservations', element: <MyPageReservations /> },
  { path: '/mypage/cancel/:reservationId', element: <MyPageCancel /> },
  { path: '/mypage/profile', element: <MyPageProfilePage /> },
  { path: '/mypage/review/write', element: <ReviewWritePage /> },
  { path: '/mypage/review/find', element: <ReviewFindPage /> },
  { path: '/mypage/reservations/checklist/:reservationId', element: <ChecklistPage /> },

  { path: '/delete', element: <DeleteAccountPage /> },

  { path: '/reservation', element: <ReservationPage /> },
  { path: '/payment', element: <PaymentPage /> },

  { path: '/cs/main', element: <CSMainPage /> },
  { path: '/cs/lost', element: <CSLostReportPage /> },
  { path: '/cs/payment', element: <CSPaymentForm /> },

  //404 fallback
  //{ path: '*', element: <h1>404 - 페이지를 찾을 수 없습니다</h1> },
];

export default routeList;

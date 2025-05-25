import ReservationPage from "./pages/Reservation/ReservationPage";
import PaymentPage from "./pages/Payment/PaymentPage";
import PaymentCompletionPage from "./pages/Payment/Payment_CompletionPage"
import CampgroundDetailPage1 from "./pages/Reservation/CampgroundDetailPage1";
import LogincheckAccountInfoPage from "./pages/Login/Login_CheckAccountInfoPage";
import MainPage from "./pages/Main/MainPage";
import CampDetailPage from "./pages/Indev/CampDetailPage";
const routeList = [

  { path: '/reservation', element: <ReservationPage /> },
  { path: '/payment', element: <PaymentPage /> },
  { path: '/payment/success', element: <PaymentCompletionPage /> },
  { path: '/detail', element: <CampgroundDetailPage1 /> },
  { path: '/test', element: <LogincheckAccountInfoPage /> },
  { path: '/', element: <MainPage /> },
  { path: '/campdetail', element: <CampDetailPage /> },

  //404 fallback
  { path: '*', element: <h1>404 - 페이지를 찾을 수 없습니다</h1> },
];

export default routeList;
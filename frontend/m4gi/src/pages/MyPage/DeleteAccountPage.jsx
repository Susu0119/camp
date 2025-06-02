"use client";
import Header from '../../components/Common/Header';
import CSSidebar from '../../components/MyPage/UI/MP_Sidebar';
import DeleteAccountForm from '../../components/MyPage/UI/DeleteAccountForm';
import NavigationBar from '../../components/Common/NavigationBar';

export const DeleteAccountPage = () => {
  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <Header showSearchBar={false} />
      <div className="flex flex-1 min-h-0">
        {/* ✅ 사이드바 */}
        <div className="hidden md:block w-64 min-h-0 overflow-y-auto border-r border-gray-200">
            <CSSidebar />
        </div>

        {/* ✅ 본문 */}
        <div className="flex-1 overflow-y-auto">
          <DeleteAccountForm />
        </div>
        <NavigationBar />
      </div>
    </div>
  );
};


export default DeleteAccountPage;

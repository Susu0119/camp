import Sidebar from "./Admin_Sidebar";

export default function AdminNoticePage() {
    return (
        <div className="min-h-screen flex bg-gray-10 select-none">
                <Sidebar />
            <main className="flex-1 flex items-center justify-center h-screen overflow-y-auto pl-72">
                <div className="flex flex-col items-center justify-center w-full text-center">
                    <h1 className="text-3xl text-black/80 font-bold mb-4">📢 공지사항/이벤트</h1>
                    <p className="text-gray-500 text-2xl mt-2">
                        새로운 소식이 곧 도착합니다! <span className="text-purple-700">조금만 기다려주세요 🌙</span>
                    </p>
                </div>
            </main>
        </div>
    );
  }
  
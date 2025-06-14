import Sidebar from "./Admin_Sidebar";

export default function AdminSupportPage() {
    return (
        <div className="min-h-screen bg-gray-10 flex select-none">
            <Sidebar />
            {/* pl-72 추가! */}
            <main className="flex-1 flex items-center justify-center h-screen overflow-y-auto pl-72">
                <div className="flex flex-col items-center justify-center w-full text-center">
                    <h1 className="text-3xl text-black/80 font-bold mb-4">📮 고객센터</h1>
                    <p className="text-gray-500 text-2xl mt-2">
                        아직 준비 중이에요. <span className="text-purple-700">조금만 기다려주세요! 🙏</span>
                    </p>
                </div>
            </main>
        </div>
    );
  }
  
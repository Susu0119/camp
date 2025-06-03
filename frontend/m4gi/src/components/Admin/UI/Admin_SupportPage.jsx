import Sidebar from "./Admin_Sidebar";

export default function AdminSupportPage() {
    return (
        <div className="min-h-screen bg-gray-10 flex select-none">
        <Sidebar />
        <main className="flex-1 p-10 overflow-y-auto">
      <div className="flex flex-col items-center justify-center h-full text-center p-10">
        <h1 className="text-2xl font-bold mb-4">📮 고객센터</h1>
        <p className="text-gray-500 text-base">
          아직 준비 중이에요. <span className="text-purple-600">조금만 기다려주세요! 🙏</span>
        </p>
        </div>
        </main>
      </div>
    );
  }
  
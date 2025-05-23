
import { Sidebar } from "./AdminSidebar";
import { MainContent } from "./AdminContent";

export default function AdminMainPage() {
  return (
    <div className="overflow-hidden pr-8 bg-white max-md:pr-5">
      <div className="flex gap-5 max-md:flex-col">
        <div className="w-[24%] max-md:ml-0 max-md:w-full">
          <Sidebar />
        </div>
        <div className="ml-5 w-[76%] max-md:ml-0 max-md:w-full">
          <MainContent />
        </div>
      </div>
    </div>
  );
}

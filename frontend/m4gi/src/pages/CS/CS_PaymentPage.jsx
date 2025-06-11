"use client";
import Header from "../../components/Common/Header";
import Sidebar from "../../components/CS/UI/CS_Sidebar";
import CSPaymentForm from "../../components/CS/UI/CS_PaymentForm";

export default function CSPaymentPage() {
  return (
    <div className="overflow-hidden bg-white">
      <div className="w-full bg-white min-h-[1011px] max-md:max-w-full">
        <Header showSearchBar={false} />
        <div className="flex flex-wrap items-start w-full min-h-[959px] max-md:max-w-full">
          <Sidebar />
          <CSPaymentForm />
        </div>
      </div>
    </div>
  );
}

"use client";
import React from "react";
import Header from "../../components/Common/Header";
import Sidebar from "../../components/CS/UI/CS_Sidebar";
import LostReportForm from "../../components/CS/UI/CS_LostReportForm";

export default function CSLostReportPage() {
    return (
        <div className="overflow-hidden bg-white">
            <div className="w-full bg-white min-h-[1011px] max-md:max-w-full">
                <Header showSearchBar={false} />
                <div className="flex flex-wrap items-start w-full font-bold text-black h-[924px] max-md:max-w-full">
                    <Sidebar />
                    <main className="flex flex-col items-center px-4 pt-10 pb-24 w-full max-w-[900px] mx-auto">
                        <div className="w-full max-w-[600px]">
                            <h1 className="text-3xl leading-tight">분실물 신고</h1>
                            <LostReportForm />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

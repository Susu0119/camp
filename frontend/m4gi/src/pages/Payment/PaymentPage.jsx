"use client";
import React from "react";
import Header from "../../components/Common/Header";
import PaymentForm from "../../components/Payment/UI/PaymentForm"

const PaymentPage = () => {
  return (
    <main className="flex overflow-hidden flex-col items-center">
      <Header />
      <PaymentForm />
    </main>
  );
};

export default PaymentPage;

"use client";
import React from 'react';
import Header from '../../components/Common/Header';
import PaymentCompletionForm from '../../components/Payment/UI/PaymentCompletionForm';
import NavigationBar from '../../components/Common/NavigationBar';

const PaymentCompletionPage = () => {
  return (
    <main className="flex flex-col gap-12 items-center h-[1024px] w-[1440px] max-md:gap-8 max-md:px-5 max-md:py-0 max-md:w-full max-sm:gap-5 max-sm:px-2.5 max-sm:py-0">
      <Header showSearchBar={false}/>
      <section className="flex justify-center items-center w-full">
        <article className="flex flex-col gap-8 items-start px-6 py-11 bg-white rounded-2xl border-2 border-fuchsia-700 border-solid shadow-sm w-[1252px] max-md:gap-5 max-md:px-5 max-md:py-8 max-md:w-full max-sm:gap-4 max-sm:px-4 max-sm:py-5">
          
          <PaymentCompletionForm />

          <NavigationBar/>
        </article>
      </section>
    </main>
  );
};

export default PaymentCompletionPage;

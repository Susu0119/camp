"use client";
import React from 'react';
import Header from '../../components/Common/Header';
import ProductInfo from '../../components/Reservation/UI/ProductInfo';
import RoomSelector from '../../components/Reservation/UI/siteSelector';
import GuestInfoForm from '../../components/Reservation/UI/GuestInfoForm';
import CancellationPolicy from '../../components/Reservation/UI/CancellationPolicy';
import BookingButton from '../../components/Reservation/UI/BookingButton';

const ReservationPage = () => {
  return (
    <main className="flex flex-col gap-8 items-center mx-auto my-0 bg-white h-[1315px] w-[1440px] max-md:w-full max-md:max-w-screen-lg">
      <Header />
      <section className="flex flex-col gap-3 items-center px-5 py-8 bg-white w-[1290px] max-md:p-5 max-md:w-full max-md:max-w-[900px] max-sm:p-4">
        <ProductInfo />
        <RoomSelector />
        <GuestInfoForm />
        <CancellationPolicy />
        <BookingButton />
      </section>
    </main>
  );
};

export default ReservationPage;

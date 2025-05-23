"use client";
import React from 'react';
import Header from '../../components/Common/Header';
import ReservationForm from '../../components/Reservation/UI/ReservationForm';

export default function ResGuestPage() {
  return (
    <main className="flex flex-col items-center bg-[linear-gradient(0deg,rgba(255,255,255,0.93)_0%,rgba(255,255,255,0.93)_100%)] h-screen">
      <Header />
      <ReservationForm />
    </main>
  );
};


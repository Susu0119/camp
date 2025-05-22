"use client";
import React from 'react';
import MainHeader from '../UI/MainHeader';
import ReservationForm from './UI/ReservationForm';
import NavigationVar from '../UI/NavigationVar';

export default function ResGuestPage() {
  return (
    <main className="flex flex-col items-center bg-[linear-gradient(0deg,rgba(255,255,255,0.93)_0%,rgba(255,255,255,0.93)_100%)] h-screen">
      <MainHeader />
      <ReservationForm />
      <NavigationVar />
    </main>
  );
};


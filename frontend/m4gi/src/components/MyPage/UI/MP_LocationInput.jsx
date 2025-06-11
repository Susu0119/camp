"use client";
import React from "react";
import FormField from "./MP_FormField";

export default function LocationInput ({ reservations, selectedReservationId, onChangeReservation }) {
  return (
    <FormField label="이용 장소" labelClassName="text-left w-full">

      {!reservations || reservations.length === 0 ? (
        <div className="w-full border border-gray-300 select-none rounded-md p-2 mt-1 flex items-center text-sm max-md:text-xs text-zinc-500 bg-gray-50">
          리뷰를 작성할 예약 내역이 없습니다.
        </div>
      ) : (
        <select className="w-full border border-gray-300 rounded-md p-2 mt-1 flex items-center text-sm max-md:text-xs text-zinc-500 bg-white"
          value={selectedReservationId}
          onChange={(e) => onChangeReservation(e.target.value)}
        >
        <option value="">예약을 선택하세요</option>
        {reservations.map((r) => (
          <option key={r.reservationId} value={r.reservationId}>
            {r.campgroundName} ({r.siteName})
          </option>
        ))}
      </select>
      )}
    </FormField>
  );
};

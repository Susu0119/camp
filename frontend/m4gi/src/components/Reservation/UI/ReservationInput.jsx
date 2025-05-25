import React from "react";

const ReservationInput = ({ label, name, placeholder, value, onChange }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-base font-bold text-neutral-900">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="p-3 border border-gray-300 rounded-md text-base w-full"
      />
    </div>
  );
};

export default ReservationInput;

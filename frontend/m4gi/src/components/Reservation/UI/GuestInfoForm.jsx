import React from 'react';
import ReservationInput from './ReservationInput';

const GuestInfoForm = ({ guestInfo, setGuestInfo }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <h2 className="self-stretch px-0 pt-6 pb-2 text-lg font-bold text-fuchsia-700 max-sm:text-base">
        예약자 정보
      </h2>
      <form className="w-full">
        <div className="flex flex-col gap-3 w-full">
          <div className="pt-2 w-full space-y-4">
            <ReservationInput
              label="이름"
              placeholder="이름(필수)"
              name="userName"
              value={guestInfo.userName}
              onChange={handleInputChange}
            />
          </div>
          <div className="pt-2 w-full space-y-4">
            <ReservationInput
              label="전화번호"
              placeholder="전화번호(필수)"
              name="userPhone"
              value={guestInfo.userPhone}
              onChange={handleInputChange}
            />
          </div>
          <div className="pt-2 w-full space-y-4">
            <ReservationInput
              label="이메일"
              placeholder="이메일(선택)"
              name="email"
              value={guestInfo.email}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default GuestInfoForm;

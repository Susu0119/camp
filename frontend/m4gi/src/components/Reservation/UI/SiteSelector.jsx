import React, { useState, useEffect } from 'react';

const RoomSelector = ({ rooms = [], onChange }) => {
  const [selectedRoom, setSelectedRoom] = useState(rooms[0] || '');

  useEffect(() => {
    // 부모에게 초기값도 알려줌
    if (rooms.length > 0) {
      onChange(rooms[0]);
    }
  }, [rooms, onChange]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedRoom(value);
    onChange(value);
  };

  return (
    <>
      <h2 className="self-stretch px-0 pt-3 pb-2 text-lg font-bold text-fuchsia-700 max-sm:text-base">
        객실 선택
      </h2>

      <select
        value={selectedRoom}
        onChange={handleChange}
        className="p-3 w-full bg-white rounded border border-stone-300 text-base text-black max-sm:text-sm"
      >
        {rooms.map((room, idx) => (
          <option key={idx} value={room}>
            {room}
          </option>
        ))}
      </select>
    </>
  );
};

export default RoomSelector;

import React, { useState, useEffect } from 'react';

const RoomSelector = ({ rooms = [], onChange }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    // rooms가 있을 때 초기 room 전달
    if (rooms.length > 0) {
      onChange(rooms[0]);
    }
  }, [rooms, onChange]);

  const handleChange = (e) => {
    const index = parseInt(e.target.value, 10);
    setSelectedIndex(index);
    onChange(rooms[index]); // ✅ 선택된 room 객체 전달
  };

  return (
    <>
      <h2 className="self-stretch px-0 pt-3 pb-2 text-lg font-bold text-fuchsia-700 max-sm:text-base">
        객실 선택
      </h2>

      <select
        value={selectedIndex}
        onChange={handleChange}
        className="p-3 w-full bg-white rounded border border-stone-300 text-base text-black max-sm:text-sm"
      >
        {rooms.map((room, idx) => (
          <option key={idx} value={idx}>
            {room.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default RoomSelector;

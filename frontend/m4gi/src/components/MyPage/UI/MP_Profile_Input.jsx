"use client";

import React from 'react';

const ProfileInput = ({
  type = 'text',
  placeholder,
  className = '',
  value,
  onChange
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`px-3.5 py-2.5 h-10 text-sm rounded-md border border-solid border-zinc-200 ${className}`}
    />
  );
};

export default ProfileInput;

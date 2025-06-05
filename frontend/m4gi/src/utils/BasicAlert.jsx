import * as React from 'react';
import Effect from './Effect'

export default function BasicAlert({ severity = "success", children, onClose }) {
  return (
    <Effect 
      severity={severity}
      onClose={onClose}
    >
      {children}
    </Effect>
  );
}
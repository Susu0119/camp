import React from "react";

export default function FilterTag ({ text }) {
  return (
    <button className="flex gap-2.5 items-center px-5 py-3.5 h-10 text-sm rounded-xl bg-clpurple bg-opacity-10">
      # {text}
    </button>
  );
};

import React from "react";

export default function FilterTag ({ text }) {
  return (
    <button className="gap-2.5 px-5 py-3.5 h-12 rounded-xl bg-clpurple bg-opacity-10">
      # {text}
    </button>
  );
};

import React from "react";

export default function FormSection({ title, description, children }) {
  return (
    <section className="flex flex-col pl-2.5 mt-2 w-full max-md:max-w-full">
      <h2 className="text-lg font-bold leading-none text-fuchsia-700">{title}</h2>
      <p className="flex overflow-hidden gap-2.5 items-start self-start mt-2 text-sm leading-none text-zinc-500">
        <span className="overflow-hidden gap-2.5 px-2.5">{description}</span>
      </p>
      {children}
    </section>
  );
}

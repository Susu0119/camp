import React from "react";

const InfoSection = ({ title, children }) => {
  return (
    <section className="gap-2 w-full text-base">
      <h3 className="pt-px pb-1 w-full text-base font-bold whitespace-nowrap max-md:max-w-full">
        {title}
      </h3>
      <div className="gap-1 px-4 py-4 mt-2 w-full bg-white rounded-xl border border-solid border-[color:var(--unnamed,#EDDDF4)] max-md:max-w-full">
        {children}
      </div>
    </section>
  );
};

export default InfoSection;

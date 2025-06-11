import React from "react";

const FormField = ({ label, children }) => {
  return (
    <div className="flex flex-col gap-2 items-start self-stretch px-2.5 pt-2.5 pb-4">
      <label className="text-sm font-bold leading-4 text-black max-sm:text-xs">
        {label}
      </label>
      {children}
    </div>
  );
};

export default FormField;

import React, { forwardRef } from "react";

const Input = forwardRef(({ label, type = "text", placeholder, className, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      />
    </div>
  );
});

Input.displayName = "Input";

export default Input;

"use client";

import React from "react";

const Textarea = ({ value, onChange, placeholder, label = "", ...props }) => {
  return (
    <>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <textarea
        className="mt-3 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Enter text here..."}
        rows={5}
        {...props}
      ></textarea>
    </>
  );
};

export default Textarea;

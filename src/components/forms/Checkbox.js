"use client";

import React, { forwardRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export const CustomCheckbox = forwardRef(({ label = "Accept terms and conditions", id = "terms", className, ...props }, ref) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Checkbox ref={ref} id={id} {...props} />
      <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
    </div>
  );
});

CustomCheckbox.displayName = "CustomCheckbox"; // Required when using forwardRef

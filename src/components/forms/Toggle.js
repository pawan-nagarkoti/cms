"use client";

import React, { forwardRef } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const CustomToggle = forwardRef(({ label = "Airplane Mode", id = "airplane-mode", onCheckedChange, className, ...props }, ref) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Switch ref={ref} id={id} onCheckedChange={onCheckedChange} {...props} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
});

CustomToggle.displayName = "CustomToggle"; // Required when using forwardRef

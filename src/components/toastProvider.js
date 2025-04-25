"use client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ToastProvider() {
  return <ToastContainer position="top-right" autoClose={3000} />;
}

export function showToast(message, type = "error") {
  console.log("meeee", message, type);
  if (type === "success") {
    toast.success(message);
  } else {
    toast.error(message);
  }
}

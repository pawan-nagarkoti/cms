"use client";

import Input from "@/components/forms/Input";
import { showToast } from "@/components/toastProvider";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/lib/api";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { OtpContainer } from "@/components/forms/Otp";

export default function page() {
  const router = useRouter();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleSubmitLoginFormData = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("email", loginForm?.email);
    data.append("password", loginForm?.password);
    data.append("loginOtp", loginForm?.otp);
    const otpEnteredTime = new Date();
    data.append("otpEnteredTime", otpEnteredTime);

    const response = await apiCall(`auth/login`, `POST`, data);

    if (response?.rawResponse?.success === false) {
      // if success is false
      showToast(response.message);
    }

    if (response.success) {
      // if success is true
      showToast(response.message, "success");
      Cookies.set("token", response?.user?.token, {
        expires: 7,
        path: "/",
      });
      router.push("/dashboard");
    }
  };
  return (
    // NS9MTJ
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <form onSubmit={handleSubmitLoginFormData} className="w-full max-w-sm bg-white shadow-lg rounded-xl p-8 space-y-6">
          <div className="space-y-4">
            <Input label="Email" placeholder="Enter your email" name="email" value={loginForm.email} onChange={handleChange} />
            <Input label="Password" placeholder="Enter your password" name="password" value={loginForm.password} onChange={handleChange} />
          </div>

          <div className="relative flex items-center justify-center">
            <span className="text-sm text-gray-500 px-2 bg-white z-10">OR</span>
            <span className="absolute left-0 right-0 h-px bg-gray-300" />
          </div>

          <div>
            <label htmlFor="otp" className="block text-sm text-gray-600 mb-1">
              OTP
            </label>
            <OtpContainer handleChange={handleChange} name="otp" />
          </div>

          <div className="text-right">
            <Link href="/login" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button className="w-full" type="submit">
            Submit
          </Button>

          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-blue-600 font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

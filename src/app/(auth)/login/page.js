"use client";

import Input from "@/components/forms/Input";
import { showToast } from "@/components/toastProvider";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/lib/api";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function page() {
  const router = useRouter();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
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

    const response = await apiCall(`auth/login`, `POST`, data);

    if (response?.error) {
      showToast(response.message);
    } else {
      showToast(response.message, "success");
      Cookies.set("token", response?.user?.token, {
        expires: 7,
        path: "/",
      });
      router.push("/dashboard");
    }
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <form onSubmit={handleSubmitLoginFormData}>
          <div className="min-w-[360px] space-y-4 p-10 border-r-2 shadow-custom">
            <div>
              <Input label="Email" placeholder="Enter your email" name="email" value={loginForm.email} onChange={handleChange} />
            </div>
            <div>
              <Input label="Password" placeholder="Enter your password" name="password" value={loginForm.password} onChange={handleChange} />
            </div>
            <div className="text-gray-500 font-semibold hover:underline">
              <Link href={`/login`}>Forgot Password</Link>
            </div>
            <div className="text-center">
              <Button className="w-full">submit</Button>
            </div>
            <p>
              Don't have an account ?{" "}
              <Link href={`/signup`} className="text-gray-500 font-semibold hover:underline">
                SignUp
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

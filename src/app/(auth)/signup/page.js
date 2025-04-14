"use client";

import Input from "@/components/forms/Input";
import { showToast } from "@/components/toastProvider";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function page() {
  const router = useRouter();
  const [loginForm, setLoginForm] = useState({
    username: "",
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
    data.append("username", loginForm?.username);
    data.append("email", loginForm?.email);
    data.append("password", loginForm?.password);

    const response = await apiCall(`auth/signup`, `POST`, data);

    if (response?.error) {
      showToast(response.message);
    } else {
      showToast(response.message, "success");
      router.push("/login");
    }
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <form onSubmit={handleSubmitLoginFormData}>
          <div className="min-w-[360px] space-y-4 p-10 border-r-2 shadow-custom">
            <div>
              <Input label="Username" placeholder="Enter your username" name="username" value={loginForm.username} onChange={handleChange} />
            </div>
            <div>
              <Input label="Email" placeholder="Enter your email" name="email" value={loginForm.email} onChange={handleChange} />
            </div>
            <div>
              <Input label="Password" placeholder="Enter your password" name="password" value={loginForm.password} onChange={handleChange} />
            </div>
            <div className="text-center">
              <Button className="w-full" type="submit">
                submit
              </Button>
            </div>

            <p>
              Don't have an account ?{" "}
              <Link href={`/login`} className="text-gray-500 font-semibold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

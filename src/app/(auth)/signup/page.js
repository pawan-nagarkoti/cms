"use client";

import Input from "@/components/forms/Input";
import { showToast } from "@/components/toastProvider";
import { Button } from "@/components/ui/button";
import { generateAlphanumericOTP, generateWelcomeEmail } from "@/config/constants";
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

    // email data
    const emailData = {
      from: loginForm?.email,
      subject: "Test Email from Next.js",
      text: "Hello plain text",
      // generate html template
      html: generateWelcomeEmail({
        username: loginForm.username,
        email: loginForm.email,
        password: loginForm.password,
      }),
    };

    const emailResponse = await apiCall("send-email", `POST`, emailData); // email send with otp

    if (emailResponse.success) {
      const now = new Date();
      const otpSentAt = new Date(now.getTime() + 5 * 60000); // generate otp time with 5 minute later to current time

      const generateOtp = generateAlphanumericOTP();
      data.append("otp", generateOtp);
      data.append("otpSentAt", otpSentAt);

      showToast(emailResponse.message, "success");

      const response = await apiCall(`auth/signup`, `POST`, data);

      if (response) {
        showToast(response.message, "success");
        router.push("/login");
      } else {
        showToast(res.message);
      }
    } else {
      console.log("something wrong with signup");
      showToast(res.message);
    }

    // if (response?.error) {
    //   showToast(response.message, "error");
    // } else {
    // const data = {
    //   from: loginForm?.email,
    //   subject: "Test Email from Next.js",
    //   text: "Hello plain text",
    //   html: generateWelcomeEmail({
    //     username: loginForm.username,
    //     email: loginForm.email,
    //     password: loginForm.password,
    //   }),
    // };
    // const res = await apiCall("send-email", `POST`, data);
    // console.log(res.rawResponse);
    // if (res.success === false) {
    //   showToast(res.message);
    // } else {
    //   const now = new Date();
    //   const otpSentAt = new Date(now.getTime() + 5 * 60000); // 5 minutes later

    //   data.append("otp", generateAlphanumericOTP);
    //   data.append("otpSentAt", otpSentAt);

    //   showToast(response.message, "success");
    //   showToast(res.message, "success");

    //   // router.push("/login");
    // }
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

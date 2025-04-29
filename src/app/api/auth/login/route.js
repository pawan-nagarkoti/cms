import connectToDB from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Login from "@/models/login";
import { JWT_SECRET } from "@/config/constants";
import jwt from "jsonwebtoken";
import SignUp from "@/models/sign-up";
import { User } from "lucide-react";

export async function POST(req) {
  try {
    await connectToDB();

    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    const { email, password, loginOtp, otpEnteredTime } = data;
    console.log("password", password);

    // ✅ Validate required fields
    if (!email || (!password && !loginOtp)) {
      return NextResponse.json(
        {
          success: false,
          message: "Fields are required.",
        },
        { status: 400 }
      );
    }

    // ✅ Check if email exists
    const user = await SignUp.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials.",
        },
        { status: 401 }
      );
    }

    // ✅ Verify password

    if (password) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid credentials.",
          },
          { status: 401 }
        );
      }
    }

    if (loginOtp) {
      if (user.otp !== loginOtp) {
        return NextResponse.json(
          {
            success: false,
            message: "OTP is not matched",
          },
          { status: 401 }
        );
      } else if (otpEnteredTime > user.otpSentAt) {
        return NextResponse.json(
          {
            success: false,
            message: "OTP Is Expired",
          },
          { status: 401 }
        );
      }
    }

    // ✅ Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" } // You can customize expiry
    );

    // ✅ Return minimal user data
    return NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          token,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during login.",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}

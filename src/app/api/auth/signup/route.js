import connectToDB from "@/lib/db";
import Login from "@/models/login";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import SignUp from "@/models/sign-up";

export async function POST(req) {
  try {
    await connectToDB();

    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    const { username, email, password, otp, otpSentAt } = data;

    // ✅ Basic Validation
    if (!username || !email || !password) {
      return NextResponse.json({ success: false, message: "All fields are required." }, { status: 400 });
    }

    // ✅ Check if user already exists
    const existingUser = await SignUp.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "User already exists with this email." }, { status: 409 });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await SignUp.create({
      username,
      email,
      password: hashedPassword,
      otp,
      otpSentAt,
    });

    console.log("neee", newUser);

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully.",
        data: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Login Error:", error?.message);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong during Login.",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await connectToDB();
    const data = await SignUp.deleteMany({});
    return NextResponse.json(
      {
        message: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error?.message);
    return NextResponse.json(
      {
        message: error?.message,
      },
      { status: 500 }
    );
  }
}

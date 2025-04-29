import mongoose from "mongoose";

const SignUpSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    otp: {
      type: String,
    },
    otpSentAt: {
      type: String,
    },
  },
  { timestamps: true }
);

const SignUp = mongoose.models.SignUp || mongoose.model("SignUp", SignUpSchema);

export default SignUp;

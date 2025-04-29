import mongoose from "mongoose";

const LoginSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    otp: {
      type: String,
    },
  },
  { timestamps: true }
);

const Login = mongoose.models.Login || mongoose.model("Login", LoginSchema);

export default Login;

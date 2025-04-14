import mongoose from "mongoose";

const LoginSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

const Login = mongoose.models.Login || mongoose.model("Login", LoginSchema);

export default Login;

import mongoose from "mongoose";

const BuilderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Builder name is required"],
      trim: true,
    },
    longDescription: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    featured: { type: Boolean, default: false },
    index: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Builder = mongoose.models.Builder || mongoose.model("Builder", BuilderSchema);

export default Builder;

import mongoose from "mongoose";

const citiesSchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    abbrevation: String,
    metaTitle: String,
    metaDescription: String,
    metaKeyword: String,
    description: String,
    longDescription: String,
    activeState: [{ type: String }],
    featured: { type: Boolean, default: false },
    index: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const City = mongoose.models.City || mongoose.model("City", citiesSchema);

export default City;

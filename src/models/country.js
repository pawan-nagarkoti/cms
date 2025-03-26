import mongoose from "mongoose";

const CountrySchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    abbrevation: String,
    metaTitle: String,
    metaDescription: String,
    metaKeyword: String,
    description: String,
    featured: { type: Boolean, default: false },
    index: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Country = mongoose.models.Country || mongoose.model("Country", CountrySchema);

export default Country;

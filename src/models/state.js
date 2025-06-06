import mongoose from "mongoose";

const StateSchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    abbrevation: String,
    metaTitle: String,
    metaDescription: String,
    metaKeyword: String,
    description: String,
    longDescription: String,
    activeCountry: [{ type: String }],
    featured: { type: Boolean, default: false },
    index: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const State = mongoose.models.State || mongoose.model("State", StateSchema);

export default State;

import mongoose from "mongoose";

const MicrocitiesSchema = new mongoose.Schema(
  {
    name: String,
    metaTitle: String,
    metaDescription: String,
    metaKeyword: String,
    longDescription: String,
    activeCountry: { type: mongoose.Schema.Types.ObjectId, ref: "Country" },
    activeState: { type: mongoose.Schema.Types.ObjectId, ref: "State" },
    activeCity: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
    featured: { type: Boolean, default: false },
    index: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Microcities = mongoose.models.Microcities || mongoose.model("Microcities", MicrocitiesSchema);

export default Microcities;

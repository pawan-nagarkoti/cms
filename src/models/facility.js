import mongoose from "mongoose";

const FacilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Amenity name is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "image is required"],
      trim: true,
    },
    featured: { type: Boolean, default: false },
    index: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Facility = mongoose.models.Facility || mongoose.model("Facility", FacilitySchema);

export default Facility;

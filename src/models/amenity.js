import mongoose from "mongoose";

const AmenitySchema = new mongoose.Schema(
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

const Amenity = mongoose.models.Amenity || mongoose.model("Amenity", AmenitySchema);

export default Amenity;

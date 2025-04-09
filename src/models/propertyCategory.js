import mongoose from "mongoose";

const propertyCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "image is required"],
      trim: true,
    },
    alt: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    featured: { type: Boolean, default: false },
    index: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PropertyCategory = mongoose.models.PropertyCategory || mongoose.model("PropertyCategory", propertyCategorySchema);

export default PropertyCategory;

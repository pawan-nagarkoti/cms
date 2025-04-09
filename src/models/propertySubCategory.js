import mongoose from "mongoose";

const propertySubCategorySchema = new mongoose.Schema(
  {
    categoryName: { type: mongoose.Schema.Types.ObjectId, ref: "PropertyCategory" },
    subCategoryName: {
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

const PropertySubCategory = mongoose.models.PropertySubCategory || mongoose.model("PropertySubCategory", propertySubCategorySchema);

export default PropertySubCategory;

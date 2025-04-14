import mongoose from "mongoose";
import Project from "../project";
import Topology from "../topology";

const propertySchema = new mongoose.Schema(
  {
    projectName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Project,
      required: [true, "Project name is required"],
    },
    builder: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    propertyTitle: {
      type: String,
      required: true,
      trim: true,
    },
    propertySlug: {
      type: String,
      required: true,
      trim: true,
    },
    priceType: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    priceUnit: {
      type: String,
      requried: true,
    },
    minPrice: {
      type: String,
      requried: true,
    },
    minPriceUnit: {
      type: String,
      requried: true,
    },
    maxPrice: {
      type: String,
      requried: true,
    },
    maxPriceUnit: {
      type: String,
      requried: true,
    },
    minSize: {
      type: String,
      requried: true,
    },
    minSizeUnit: {
      type: String,
      requried: true,
    },
    maxSize: {
      type: String,
      requried: true,
    },
    maxSizeUnit: {
      type: String,
      requried: true,
    },
    propertySubCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: PropertySubCategory,
      requried: true,
    },
    topology: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Topology,
      required: true,
    },
    microsite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Microcities,
      requried: true,
    },
    amenties: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Amenity,
      required: true,
    },
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Facility,
      required: true,
    },
    completionOn: {
      type: String,
      required: true,
    },
    possionOn: {
      type: String,
      required: true,
    },
    possionDropdown: {
      type: String,
      requried: true,
    },
    longDescription: {
      type: String,
      required: true,
    },
    relatedPropertyLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Microcities,
    },
    featuredImage: {
      type: String,
    },
    featuredImageTitle: {
      type: String,
    },
    featuredImageAlt: {
      type: String,
    },
    featured: { type: Boolean, default: false },
    index: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Property = mongoose.models.Property || mongoose.model("Property", propertySchema);

export default Property;

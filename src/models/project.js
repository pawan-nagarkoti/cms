import mongoose from "mongoose";
import Country from "./country";

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Project name is required"] },
    builder: { type: mongoose.Schema.Types.ObjectId, ref: "Builder" },
    propertyCategory: { type: mongoose.Schema.Types.ObjectId, ref: "PropertyCategory" },
    country: { type: mongoose.Schema.Types.ObjectId, ref: "Country" },
    state: { type: mongoose.Schema.Types.ObjectId, ref: "State" },
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
    featured: { type: Boolean, default: false },
    index: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default Project;

import mongoose from "mongoose";

const TagSchema = new mongoose.Schema(
  {
    name: String,
    index: Boolean,
    status: Boolean,
  },
  { timestamps: true }
);

const Tag = mongoose.models.Tag || mongoose.model("Tag", TagSchema);

export default Tag;

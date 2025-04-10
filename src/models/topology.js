import mongoose from "mongoose";

const TopologySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    propertyCategory: { type: mongoose.Schema.Types.ObjectId, ref: "PropertyCategory" },
    longDescription: {
      type: String,
      required: true,
      trim: true,
    },
    featured: { type: Boolean, default: false },
    index: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Topology = mongoose.models.Topology || mongoose.model("Topology", TopologySchema);

export default Topology;

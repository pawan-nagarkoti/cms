import mongoose from "mongoose";

const FloorSchema = new mongoose.Schema(
  {
    type: {
      type: String,
    },
    price: {
      type: String,
    },
    title: {
      type: String,
    },
    alt: {
      type: String,
    },
    image: {
      type: String,
    },
    projectID: {
      type: String,
    },
  },
  { timestamps: true }
);

const Floor = mongoose.models.Floor || mongoose.model("Floor", FloorSchema);

export default Floor;

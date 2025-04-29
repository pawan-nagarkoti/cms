import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    title: {
      type: String,
    },
    alt: {
      type: String,
    },
    projectID: {
      type: String,
      requuired: true,
    },
  },
  { timestamps: true }
);

const Image = mongoose.models.Image || mongoose.model("Image", ImageSchema);

export default Image;

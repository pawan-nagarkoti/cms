import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

const Image = mongoose.models.Image || mongoose.model("Image", GallerySchema);

export default Image;

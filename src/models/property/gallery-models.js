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

const Gallery = mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);

export default Gallery;

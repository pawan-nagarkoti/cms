import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true },
    shortDescription: { type: String, trim: true },
    thumbnailImage: { type: String, trim: true },
    featuredImage: { type: String, trim: true },
    metaTitle: { type: String, trim: true },
    metaKeywords: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    canonicalTag: { type: String, trim: true },
    hrefLangTag: { type: String, trim: true },
    geoRegion: { type: String, trim: true },
    geoPlacename: { type: String, trim: true },
    geoPosition: { type: String, trim: true },
    icbm: { type: String, trim: true },
    twitterCard: { type: String, trim: true },
    twitterURL: { type: String, trim: true },
    twitterTitle: { type: String, trim: true },
  },
  { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;

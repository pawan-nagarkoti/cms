import connectToDB from "@/lib/db";
import Blog from "@/models/blog";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { BlogSchema } from "@/schema/blogSchema";
import { convertBase64 } from "@/lib/cloudinary";
import Category from "@/models/category";
import Tag from "@/models/tag";

// fetch single blogs
export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { id } = params; // ✅ Get ID from dynamic route

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing blog ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Fetch blog from MongoDB
    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json(
      { success: true, data: blog },
      { status: 200 } // ✅ 200 OK for successful retrieval
    );
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { success: false, message: "Something went wrong! Please try again" },
      { status: 500 } // Internal Server Error
    );
  }
}

// delete blog
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params; // ✅ Get ID from dynamic route

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing blog ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Try deleting the category
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json(
      { success: true, message: "Blog deleted successfully" },
      { status: 200 } // ✅ 200 OK for successful deletion
    );
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong! Please try again" },
      { status: 500 } // Internal Server Error
    );
  }
}

// update blog
export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { id } = params; // ✅ Correct way to get ID in Next.js 14

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing blog ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Parse the request body
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    // A common utility function to convert images to Base64 URLs. If the input is already a valid image URL, it returns the URL as-is
    const convertImagesIntoUrl = async (imageKey, imageName) => {
      try {
        const url = new URL(imageKey);
        if (url.protocol === "http:" || url.protocol === "https:") {
          return imageKey;
        } else {
          throw new Error("Not an HTTP/HTTPS URL");
        }
      } catch (err) {
        const image = formData.get(imageName);
        if (image) {
          const generateUrl = await convertBase64(image);
          return generateUrl;
        }
      }
    };

    let thumbnailUrl = await convertImagesIntoUrl(data?.thumbnailImage, "thumbnailImage");
    let featuredUrl = await convertImagesIntoUrl(data?.featuredImage, "featuredImage");

    // ✅ Extract values manually when indexed keys are used
    const categories = [];
    const tags = [];

    // Iterate through all formData entries
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("categories[")) {
        categories.push(value);
      }
      if (key.startsWith("tags[")) {
        tags.push(value);
      }
    }
    // find category and id on database
    const categoriesContainer = await Category.find({ _id: { $in: categories } });
    const tagContainer = await Tag.find({ _id: { $in: tags } });

    // Store the received data in MongoDB
    const updatedBlogData = {
      title: data.title || "",
      slug: data.slug || "",
      shortDescription: data.shortDescription || "",
      thumbnailImage: thumbnailUrl || "",
      featuredImage: featuredUrl || "",
      metaTitle: data.metaTitle || "",
      metaKeywords: data.metaKeywords || "",
      metaDescription: data.metaDescription || "",
      canonicalTag: data.canonicalTag || "",
      hrefLangTag: data.hrefLangTag || "",
      geoRegion: data.geoRegion || "",
      geoPlacename: data.geoPlacename || "",
      geoPosition: data.geoPosition || "",
      icbm: data.icbm || "",
      twitterCard: data.twitterCard || "",
      twitterURL: data.twitterURL || "",
      twitterTitle: data.twitterTitle || "",
      longDescription: data.longDescription || "",
      categories: categoriesContainer || [],
      tags: tagContainer || [],
      featured: data.featured || false,
      index: data.index || false,
      status: data.status || false,
    };

    const updateBlog = await Blog.findOneAndUpdate({ _id: id }, updatedBlogData, { new: true });

    return NextResponse.json({ success: true, message: "Blog updated successfully", data: updateBlog }, { status: 200 });
  } catch (error) {
    console.error("Error updating blogs:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong! Please try again" },
      { status: 500 } // Internal Server Error
    );
  }
}

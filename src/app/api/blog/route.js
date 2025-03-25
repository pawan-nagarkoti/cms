import connectToDB from "@/lib/db";
import { NextResponse } from "next/server";
import Blog from "@/models/blog";
import { convertBase64 } from "@/lib/cloudinary";
import Category from "@/models/category";
import Tag from "@/models/tag";
import { BlogSchema } from "@/schema/blogSchema";

export async function POST(req) {
  try {
    await connectToDB();
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());
    const thumbnailImage = formData.get("thumbnailImage");
    const featuredImage = formData.get("featuredImage");

    let thumbnailUrl = "";
    let featuredUrl = "";

    // Convert File to base64 and upload to Cloudinary
    if (thumbnailImage) {
      thumbnailUrl = await convertBase64(thumbnailImage);
    }

    if (featuredImage) {
      featuredUrl = await convertBase64(featuredImage);
    }

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

    // ✅ Prepare Data for Joi Validation
    const validatiaonSchema = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      shortDescription: formData.get("shortDescription"),
      thumbnailImage,
      featuredImage,
    };

    // ✅ Validate Data with Joi
    const { error } = BlogSchema.validate(validatiaonSchema, { abortEarly: true }); // ✅ Only return the first error
    if (error) {
      return NextResponse.json(
        { success: false, message: error.details[0].message }, // ✅ Show only the first error
        { status: 400 }
      );
    }

    // Store the received data in MongoDB
    const blogData = {
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

    const newlyCreatedBlog = await Blog.create(blogData);
    return NextResponse.json(
      {
        success: true,
        data: newlyCreatedBlog,
        message: "Blog added successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong! Please try again",
      },
      { status: 500 }
    );
  }
}

// fetch all blogs
export async function GET() {
  try {
    await connectToDB();
    const extractAllBlogsFromDatabase = await Blog.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: extractAllBlogsFromDatabase,
      message: "Fetch blog successfully",
    });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong! Please try again",
      },
      { status: 500 } // Internal Server Error
    );
  }
}

// delete all blogs
export async function DELETE() {
  try {
    await Blog.deleteMany({});

    return NextResponse.json({
      success: true,
      data: [],
      message: "Deleted all Blogs",
    });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong! Please try again",
      },
      { status: 500 }
    );
  }
}

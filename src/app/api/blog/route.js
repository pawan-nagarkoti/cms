import connectToDB from "@/lib/db";
import { NextResponse } from "next/server";
import Blog from "@/models/blog";
import { convertBase64 } from "@/lib/utils";

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
    const extractAllBlogsFromDatabase = await Blog.find({});

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

import connectToDB from "@/lib/db";
import { NextResponse } from "next/server";
import { AddNewBlogSchema } from "@/schema/blogSchema";
import Blog from "@/models/blog";

// Add blog
export async function POST(req) {
  try {
    await connectToDB();

    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    // Store the received data
    const blogData = {
      title: data.title || "",
      slug: data.slug || "",
      shortDescription: data.shortDescription || "",
      thumbnailImage: data.thumbnailImage || "",
      featuredImage: data.featuredImage || "",
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

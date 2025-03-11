import connectToDB from "@/lib/db";
import Blog from "@/models/blog";
import { NextResponse } from "next/server";
import { AddNewBlogSchema } from "@/schema/blogSchema";

// Add blog
export async function POST(req) {
  try {
    await connectToDB();

    const extractBlogData = await req.json();
    const { title, description } = extractBlogData;

    // ✅ Validate before inserting into DB
    const { error } = AddNewBlogSchema.validate({ title, description });

    if (error) {
      return NextResponse.json(
        { success: false, message: error.details[0].message },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Now proceed with DB insertion
    const newlyCreatedBlog = await Blog.create(extractBlogData);

    return NextResponse.json(
      {
        success: true,
        data: newlyCreatedBlog,
        message: "Blog added successfully",
      },
      { status: 201 } // Created
    );
  } catch (error) {
    console.error(error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong! Please try again",
      },
      { status: 500 } // Internal Server Error
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

import connectToDB from "@/lib/db";
import Tag from "@/models/tag";
import { TagSchema } from "@/schema/tag-schema";
import { NextResponse } from "next/server";

// add tag
export async function POST(req) {
  try {
    await connectToDB();

    const extractTag = await req.json();
    const { name, index, status } = extractTag;

    // ✅ Validate before inserting into DB
    const { error } = TagSchema.validate({ name, index, status });

    if (error) {
      return NextResponse.json(
        { success: false, message: error.details[0].message },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Now proceed with DB insertion
    const newlyCreatedTag = await Tag.create(extractTag);

    return NextResponse.json(
      {
        success: true,
        data: newlyCreatedTag,
        message: "Tag added successfully",
      },
      { status: 201 } // Created
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

// fetch all Tag
export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Define filter conditionally
    const filter = status ? { status } : {}; // If status exists, filter by status, otherwise fetch all

    // Fetch tag sorted by newest first (createdAt in descending order)
    const extractAllTagFromDatabase = await Tag.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: extractAllTagFromDatabase,
      message: "Fetch tag successfully",
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

// delete all tag
export async function DELETE() {
  try {
    await Tag.deleteMany({});

    return NextResponse.json({
      success: true,
      data: [],
      message: "Deleted all tag",
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

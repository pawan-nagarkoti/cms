import connectToDB from "@/lib/db";
import Category from "@/models/category";
import { CategorySchema } from "@/schema/categorySchema";
import { NextResponse } from "next/server";

// add category
export async function POST(req) {
  try {
    await connectToDB();

    const extractCategory = await req.json();
    const { name, index, status } = extractCategory;

    // ✅ Validate before inserting into DB
    const { error } = CategorySchema.validate({ name, index, status });

    if (error) {
      return NextResponse.json(
        { success: false, message: error.details[0].message },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Now proceed with DB insertion
    const newlyCreatedCategory = await Category.create(extractCategory);

    return NextResponse.json(
      {
        success: true,
        data: newlyCreatedCategory,
        message: "Category added successfully",
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
      { status: 500 } // Internal Server Error
    );
  }
}

// fetch all category
export async function GET(request) {
  try {
    await connectToDB();

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1; // Default to page 1
    const limit = parseInt(searchParams.get("limit")) || 2; // Default to 10 items per page
    const skip = (page - 1) * limit; // Calculate how many to skip

    // Fetch categories sorted by newest first and apply pagination
    const extractAllCategoryFromDatabase = await Category.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);

    // Get total document count for pagination metadata
    const totalDocuments = await Category.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);

    return NextResponse.json({
      success: true,
      data: extractAllCategoryFromDatabase,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalDocuments,
        perPage: limit,
      },
      message: "Fetch category successfully",
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

// delete all category
export async function DELETE() {
  try {
    await Category.deleteMany({});

    return NextResponse.json({
      success: true,
      data: [],
      message: "Deleted all category",
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

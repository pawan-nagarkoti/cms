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
export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Define filter conditionally
    const filter = status ? { status } : {}; // If status exists, filter by status, otherwise fetch all

    // Fetch categories sorted by newest first (createdAt in descending order)
    const categories = await Category.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: categories,
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

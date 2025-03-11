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
export async function GET() {
  try {
    await connectToDB();
    const extractAllCategoryFromDatabase = await Category.find({});

    return NextResponse.json({
      success: true,
      data: extractAllCategoryFromDatabase,
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

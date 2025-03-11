import connectToDB from "@/lib/db";
import Category from "@/models/category";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { CategorySchema } from "@/schema/categorySchema";

// delete category
// params should be always second parameter if dont take params as a second its getting error.
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params; // ✅ Get ID from dynamic route

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing category ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Try deleting the category
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json(
      { success: true, message: "Category deleted successfully" },
      { status: 200 } // ✅ 200 OK for successful deletion
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong! Please try again" },
      { status: 500 } // Internal Server Error
    );
  }
}

// get single category
export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { id } = params; // ✅ Get ID from dynamic route

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing category ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Fetch category from MongoDB
    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json(
      { success: true, data: category },
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

// update category
export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { id } = params; // ✅ Correct way to get ID in Next.js 14

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing category ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Parse the request body
    const categoryData = await req.json();

    // ✅ Validate request data using Joi
    const { error } = CategorySchema.validate(categoryData);
    if (error) {
      return NextResponse.json({ success: false, message: error.details[0].message }, { status: 400 });
    }

    // ✅ Update category in MongoDB
    const updatedCategory = await Category.findOneAndUpdate({ _id: id }, categoryData, { new: true });

    // ✅ If category is not found, return 404
    if (!updatedCategory) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Category updated successfully", data: updatedCategory }, { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong! Please try again" },
      { status: 500 } // Internal Server Error
    );
  }
}

import connectToDB from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Tag from "@/models/tag";
import { TagSchema } from "@/schema/tag-schema";

// delete tag
// params should be always second parameter if dont take params as a second its getting error.
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params; // ✅ Get ID from dynamic route

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing tag ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Try deleting the tag
    const deletedTag = await Tag.findByIdAndDelete(id);

    if (!deletedTag) {
      return NextResponse.json(
        { success: false, message: "Tag not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json(
      { success: true, message: "Tag deleted successfully" },
      { status: 200 } // ✅ 200 OK for successful deletion
    );
  } catch (error) {
    console.error(error.message);
    return NextResponse.json(
      { success: false, message: "Something went wrong! Please try again" },
      { status: 500 } // Internal Server Error
    );
  }
}

// get single tag
export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { id } = params; // ✅ Get ID from dynamic route

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing tag ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Fetch tag from MongoDB
    const tag = await Tag.findById(id);

    if (!tag) {
      return NextResponse.json(
        { success: false, message: "Tag not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json(
      { success: true, data: tag },
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

// update tag
export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { id } = params; // ✅ Correct way to get ID in Next.js 14

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing tag ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Parse the request body
    const tagData = await req.json();

    // ✅ Validate request data using Joi
    const { error } = TagSchema.validate(tagData);
    if (error) {
      return NextResponse.json({ success: false, message: error.details[0].message }, { status: 400 });
    }

    // ✅ Update tag in MongoDB
    const updatedTag = await Tag.findOneAndUpdate({ _id: id }, tagData, { new: true });

    // ✅ If category is not found, return 404
    if (!updatedTag) {
      return NextResponse.json({ success: false, message: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Tag updated successfully", data: updatedTag }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Something went wrong! Please try again" },
      { status: 500 } // Internal Server Error
    );
  }
}

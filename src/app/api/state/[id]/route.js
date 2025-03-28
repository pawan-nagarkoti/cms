import connectToDB from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import State from "@/models/state";
import { convertImagesIntoUrl } from "@/lib/helper";

// fetch single state
export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing state ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Fetch blog from MongoDB
    const state = await State.findById(id);

    if (!state) {
      return NextResponse.json(
        { success: false, message: "state not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json(
      { success: true, data: state },
      { status: 200 } // ✅ 200 OK for successful retrieval
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

// delete state on the basis of id parms
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params; // ✅ Get ID from dynamic route

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing country ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Try deleting the category
    const deletedState = await State.findByIdAndDelete(id);

    if (!deletedState) {
      return NextResponse.json(
        { success: false, message: "State not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json(
      { success: true, message: "State deleted successfully" },
      { status: 200 } // ✅ 200 OK for successful deletion
    );
  } catch (error) {
    console.error("Error deleting state:", error?.message);
    return NextResponse.json(
      { success: false, message: "Something went wrong! Please try again" },
      { status: 500 } // Internal Server Error
    );
  }
}

// updated state
export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing blog ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Parse the request body
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());
    const stateUrl = await convertImagesIntoUrl(data?.image, "image", formData); // this line is used for if we have new image then convert into the URL otherwise return as it is image url.

    const countries = [];

    // Iterate through all formData entries
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("activeCountry[")) {
        countries.push(value);
      }
    }

    const stateData = {
      name: data?.name,
      image: stateUrl || "",
      abbrevation: data?.abbrevation,
      metaTitle: data?.metaTitle,
      metaDescription: data?.metaDescription,
      metaKeyword: data?.metaKeyword,
      description: data?.description,
      activeCountry: countries || [],
      featured: data?.featured,
      index: data?.index,
      status: data?.status,
    };

    const updatedState = await State.findOneAndUpdate({ _id: id }, stateData, { new: true });

    return NextResponse.json(
      {
        success: true,
        message: "State updated successfully",
        data: updatedState,
      },
      { status: 200 }
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

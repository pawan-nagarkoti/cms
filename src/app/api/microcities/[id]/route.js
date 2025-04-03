import connectToDB from "@/lib/db";
import Microcities from "@/models/microcities";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// fetch single countries
export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing microsite ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Fetch blog from MongoDB
    const microcity = await Microcities.findById(id);

    if (!microcity) {
      return NextResponse.json(
        { success: false, message: "microcity not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json(
      { success: true, data: microcity },
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

// delete microcity on the basis of id parms
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params; // ✅ Get ID from dynamic route

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing microcity ID" },
        { status: 400 } // Bad Request
      );
    }

    const deletedMicrocity = await Microcities.findByIdAndDelete(id);

    if (!deletedMicrocity) {
      return NextResponse.json(
        { success: false, message: "Microcity not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json(
      { success: true, message: "microcity deleted successfully" },
      { status: 200 } // ✅ 200 OK for successful deletion
    );
  } catch (error) {
    console.error("Error deleting microcity:", error?.message);
    return NextResponse.json(
      { success: false, message: "Something went wrong! Please try again" },
      { status: 500 } // Internal Server Error
    );
  }
}

// updated microcity
export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing microcity ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Parse the request body
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    const microcityData = {
      name: data?.name,
      metaTitle: data?.metaTitle,
      metaDescription: data?.metaDescription,
      metaKeyword: data?.metaKeyword,
      description: data?.description,
      longDescription: data?.longDescription,
      activeCountry: data?.activeCountry,
      activeState: data?.activeState,
      activeCity: data?.activeCity,
      featured: data?.featured,
      index: data?.index,
      status: data?.status,
    };

    const updatedMicrocity = await Microcities.findOneAndUpdate({ _id: id }, microcityData, { new: true });

    return NextResponse.json(
      {
        success: true,
        message: "Microcity updated successfully",
        data: updatedMicrocity,
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

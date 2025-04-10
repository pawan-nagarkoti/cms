import connectToDB from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { convertImagesIntoUrl } from "@/lib/helper";
import Amenity from "@/models/amenity";

// fetch single amenity
export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing amenity ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Fetch blog from MongoDB
    const amenity = await Amenity.findById(id);

    if (!amenity) {
      return NextResponse.json(
        { success: false, message: "amenity not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json({ success: true, data: amenity }, { status: 200 });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      {
        success: false,
        message: error?.message,
      },
      { status: 500 }
    );
  }
}

// delete amenity on the basis of id parms
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params; // ✅ Get ID from dynamic route

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing amenity ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Try deleting the amenity
    const deletedAmenity = await Amenity.findByIdAndDelete(id);

    if (!deletedAmenity) {
      return NextResponse.json(
        { success: false, message: "Amenity not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json({ success: true, message: "Amenity deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting country:", error?.message);
    return NextResponse.json({ success: false, message: error?.message }, { status: 500 });
  }
}

// updated amentity
export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing amenity ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Parse the request body
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());
    const amenityUrl = await convertImagesIntoUrl(data?.image, "image", formData); // this line is used for if we have new image then convert into the URL otherwise return as it is image url.

    const amenityData = {
      name: data?.name,
      image: amenityUrl || "",
      featured: data?.featured,
      index: data?.index,
      status: data?.status,
    };

    const updatedAmenity = await Amenity.findOneAndUpdate({ _id: id }, amenityData, { new: true });

    return NextResponse.json(
      {
        success: true,
        message: "Amenity updated successfully",
        data: updatedAmenity,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("update amenity error", error.message);
    return NextResponse.json(
      {
        success: false,
        message: error?.message,
      },
      { status: 500 }
    );
  }
}

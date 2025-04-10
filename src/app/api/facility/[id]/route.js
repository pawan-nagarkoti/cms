import connectToDB from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { convertImagesIntoUrl } from "@/lib/helper";
import Facility from "@/models/facility";

// fetch single facility
export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing facility ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Fetch blog from MongoDB
    const facility = await Facility.findById(id);

    if (!facility) {
      return NextResponse.json(
        { success: false, message: "facility not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json({ success: true, data: facility }, { status: 200 });
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

// delete facility on the basis of id parms
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params; // ✅ Get ID from dynamic route

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing facility ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Try deleting the facility
    const deletedAmenity = await Facility.findByIdAndDelete(id);

    if (!deletedAmenity) {
      return NextResponse.json(
        { success: false, message: "Facility not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json({ success: true, message: "Facility deleted successfully" }, { status: 200 });
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
        { success: false, message: "Invalid or missing facility ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Parse the request body
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());
    const facilityUrl = await convertImagesIntoUrl(data?.image, "image", formData); // this line is used for if we have new image then convert into the URL otherwise return as it is image url.

    const amenityData = {
      name: data?.name,
      image: facilityUrl || "",
      featured: data?.featured,
      index: data?.index,
      status: data?.status,
    };

    const updatedFacility = await Facility.findOneAndUpdate({ _id: id }, amenityData, { new: true });

    return NextResponse.json(
      {
        success: true,
        message: "Facility updated successfully",
        data: updatedFacility,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("update facility error", error.message);
    return NextResponse.json(
      {
        success: false,
        message: error?.message,
      },
      { status: 500 }
    );
  }
}

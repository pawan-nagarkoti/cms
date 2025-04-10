import connectToDB from "@/lib/db";
import Facility from "@/models/facility";
import { NextResponse } from "next/server";
import { convertBase64 } from "@/lib/cloudinary";

// fetch all facility
export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Define filter conditionally
    const filter = status ? { status } : {}; // If status exists, filter by status, otherwise fetch all

    const facility = await Facility.find(filter);
    return NextResponse.json(
      {
        success: true,
        data: facility,
        message: "Fetch facility successfully",
      },
      { status: 200 }
    );
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

// delete all facility
export async function DELETE() {
  try {
    await connectToDB();
    const deletedAllFacility = await Facility.deleteMany({});

    return NextResponse.json(
      {
        success: true,
        data: deletedAllFacility,
        message: "Deleted all facility",
      },
      { status: 200 }
    );
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

// add topology
export async function POST(req) {
  try {
    await connectToDB();
    const formData = await req.formData();
    const facilityImage = formData.get("image");
    const data = Object.fromEntries(formData.entries());

    let facilityUrl = "";

    // Convert File to base64 and upload to Cloudinary
    if (facilityImage) {
      facilityUrl = await convertBase64(facilityImage);
    }

    const amenityData = {
      name: data?.name,
      image: facilityUrl || "",
      featured: data?.featured,
      index: data?.index,
      status: data?.status,
    };

    const newlyCreatedFacility = await Facility.create(amenityData);
    return NextResponse.json(
      {
        success: true,
        data: newlyCreatedFacility,
        message: "Facility added successfully",
      },
      { status: 201 }
    );
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

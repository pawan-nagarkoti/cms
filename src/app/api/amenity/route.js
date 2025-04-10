import connectToDB from "@/lib/db";
import Amenity from "@/models/amenity";
import { NextResponse } from "next/server";
import { convertBase64 } from "@/lib/cloudinary";

// fetch all amenity
export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Define filter conditionally
    const filter = status ? { status } : {}; // If status exists, filter by status, otherwise fetch all

    const amenity = await Amenity.find(filter);
    return NextResponse.json(
      {
        success: true,
        data: amenity,
        message: "Fetch amenity successfully",
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

// delete all amenity
export async function DELETE() {
  try {
    await connectToDB();
    const deletedAllAmenity = await Amenity.deleteMany({});

    return NextResponse.json(
      {
        success: true,
        data: deletedAllAmenity,
        message: "Deleted all amenity",
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
    const amenityImage = formData.get("image");
    const data = Object.fromEntries(formData.entries());

    let amenityUrl = "";

    // Convert File to base64 and upload to Cloudinary
    if (amenityImage) {
      amenityUrl = await convertBase64(amenityImage);
    }

    const amenityData = {
      name: data?.name,
      image: amenityUrl || "",
      featured: data?.featured,
      index: data?.index,
      status: data?.status,
    };

    const newlyCreatedAmenity = await Amenity.create(amenityData);
    return NextResponse.json(
      {
        success: true,
        data: newlyCreatedAmenity,
        message: "Amenity added successfully",
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

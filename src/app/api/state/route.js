import { convertBase64 } from "@/lib/cloudinary";
import connectToDB from "@/lib/db";
import Country from "@/models/country";
import State from "@/models/state";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// fetch all states
export async function GET(req) {
  try {
    await connectToDB();
    const state = await State.find({});
    return NextResponse.json(
      {
        success: true,
        data: state,
        message: "Fetch state successfully",
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

// delete all states
export async function DELETE() {
  try {
    await State.deleteMany({});

    return NextResponse.json(
      {
        success: true,
        data: [],
        message: "Deleted all states",
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

// Add new state
export async function POST(req) {
  try {
    await connectToDB();
    const formData = await req.formData();
    const stateImage = formData.get("image");
    const data = Object.fromEntries(formData.entries());

    let stateImageUrl = "";

    // Convert File to base64 and upload to Cloudinary
    if (stateImage) {
      stateImageUrl = await convertBase64(stateImage);
    }

    // ✅ Extract values manually when indexed keys are used
    const countries = [];

    // Iterate through all formData entries
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("activeCountry[")) {
        countries.push(value);
      }
    }

    const stateData = {
      name: data?.name,
      image: stateImageUrl || "",
      abbrevation: data?.abbrevation,
      activeCountry: countries || [],
      metaTitle: data?.metaTitle,
      metaDescription: data?.metaDescription,
      metaKeyword: data?.metaKeyword,
      description: data?.description,
      longDescription: data?.longDescription,
      featured: data?.featured,
      index: data?.index,
      status: data?.status,
    };

    const newlyStateCreated = await State.create(stateData);
    return NextResponse.json(
      {
        success: true,
        data: newlyStateCreated,
        message: "State added successfully",
      },
      { status: 201 }
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

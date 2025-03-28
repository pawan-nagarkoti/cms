import { convertBase64 } from "@/lib/cloudinary";
import connectToDB from "@/lib/db";
import City from "@/models/cities";
import { NextResponse } from "next/server";

// fetch all cities
export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Define filter conditionally
    const filter = status ? { status } : {}; // If status exists, filter by status, otherwise fetch all

    const cities = await City.find(filter);
    return NextResponse.json(
      {
        success: true,
        data: cities,
        message: "Fetch city successfully",
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

// delete all cities
export async function DELETE() {
  try {
    await City.deleteMany({});

    return NextResponse.json(
      {
        success: true,
        data: [],
        message: "Deleted all cities",
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

// add new city
export async function POST(req) {
  try {
    await connectToDB();
    const formData = await req.formData();
    const cityImage = formData.get("image");
    console.log(cityImage);
    const data = Object.fromEntries(formData.entries());

    let citiesImageUrl = "";

    // Convert File to base64 and upload to Cloudinary
    if (cityImage) {
      citiesImageUrl = await convertBase64(cityImage);
    }

    // ✅ Extract values manually when indexed keys are used
    const cities = [];

    // Iterate through all formData entries
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("activeState[")) {
        cities.push(value);
      }
    }

    const cityData = {
      name: data?.name,
      image: citiesImageUrl || "",
      abbrevation: data?.abbrevation,
      activeState: cities || [],
      metaTitle: data?.metaTitle,
      metaDescription: data?.metaDescription,
      metaKeyword: data?.metaKeyword,
      description: data?.description,
      longDescription: data?.longDescription,
      featured: data?.featured,
      index: data?.index,
      status: data?.status,
    };

    const newlyCitiesCreated = await City.create(cityData);
    return NextResponse.json(
      {
        success: true,
        data: newlyCitiesCreated,
        message: "city added successfully",
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

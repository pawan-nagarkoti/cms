import { convertBase64 } from "@/lib/cloudinary";
import connectToDB from "@/lib/db";
import Country from "@/models/country";
import { NextResponse } from "next/server";

// fetch all countries
export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Define filter conditionally
    const filter = status ? { status } : {}; // If status exists, filter by status, otherwise fetch all

    const countries = await Country.find(filter);
    return NextResponse.json(
      {
        success: true,
        data: countries,
        message: "Fetch category successfully",
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

// add countries
export async function POST(req) {
  try {
    await connectToDB();
    const formData = await req.formData();
    const countryImage = formData.get("image");
    const data = Object.fromEntries(formData.entries());

    let countryUrl = "";

    // Convert File to base64 and upload to Cloudinary
    if (countryImage) {
      countryUrl = await convertBase64(countryImage);
    }

    const countryData = {
      name: data?.name,
      image: countryUrl || "",
      abbrevation: data?.abbrevation,
      metaTitle: data?.metaTitle,
      metaDescription: data?.metaDescription,
      metaKeyword: data?.metaKeyword,
      description: data?.description,
    };

    const newlyCreatedCountry = await Country.create(countryData);
    return NextResponse.json(
      {
        success: true,
        data: newlyCreatedCountry,
        message: "Country added successfully",
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

// delete all countries
export async function DELETE() {
  try {
    await Country.deleteMany({});

    return NextResponse.json(
      {
        success: true,
        data: [],
        message: "Deleted all countries",
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

import { convertBase64 } from "@/lib/cloudinary";
import connectToDB from "@/lib/db";
import Builder from "@/models/builder";
import { NextResponse } from "next/server";

// fetch all builders
export async function GET(req) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Define filter conditionally
    const filter = status ? { status } : {}; // If status exists, filter by status, otherwise fetch all

    // Fetch categories sorted by newest first (createdAt in descending order)
    const fetchBuilderData = await Builder.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: fetchBuilderData,
      message: "Fetch builder successfully",
    });
  } catch (error) {
    console.log("fetch builder error", error?.message);
    return NextResponse.json(
      {
        success: false,
        message: error?.message,
      },
      { status: 500 }
    );
  }
}

// delete all builder
export async function DELETE() {
  try {
    await connectToDB();
    const deletedAllBuilderResponse = await Builder.deleteMany({});
    return NextResponse.json(
      {
        success: true,
        data: deletedAllBuilderResponse,
        message: "Deleted all builder",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error?.message);
    return NextResponse.json(
      {
        success: false,
        message: error?.message,
      },
      { status: 500 }
    );
  }
}

// add new builder
export async function POST(req) {
  try {
    await connectToDB();
    const formData = await req.formData();
    const builderImage = formData.get("image");
    const data = Object.fromEntries(formData.entries());

    let builderImageUrl = "";

    // Convert File to base64 and upload to Cloudinary
    if (builderImage) {
      builderImageUrl = await convertBase64(builderImage);
    }

    const builderData = {
      name: data?.name,
      image: builderImageUrl || "",
      longDescription: data?.longDescription,
      address: data?.address,
      featured: data?.featured,
      index: data?.index,
      status: data?.status,
    };

    const newlyCreatedBuilder = await Builder.create(builderData);
    return NextResponse.json(
      {
        success: true,
        data: newlyCreatedBuilder,
        message: "Builder added successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error?.message);
    return NextResponse.json(
      {
        status: false,
        message: error?.message,
      },
      { status: 500 }
    );
  }
}

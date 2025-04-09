import { convertBase64 } from "@/lib/cloudinary";
import connectToDB from "@/lib/db";
import PropertyCategory from "@/models/propertyCategory";
import { NextResponse } from "next/server";

// fetch all property category
export async function GET(req) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Define filter conditionally
    const filter = status ? { status } : {}; // If status exists, filter by status, otherwise fetch all

    // Fetch categories sorted by newest first (createdAt in descending order)
    const fetchpropertyCategoryData = await PropertyCategory.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: fetchpropertyCategoryData,
      message: "Fetch property category successfully",
    });
  } catch (error) {
    console.log("fetch property category error", error?.message);
    return NextResponse.json(
      {
        success: false,
        message: error?.message,
      },
      { status: 500 }
    );
  }
}

// delete all property category
export async function DELETE() {
  try {
    await connectToDB();
    const deletedPropertyCategoryResponse = await PropertyCategory.deleteMany({});
    return NextResponse.json(
      {
        success: true,
        data: deletedPropertyCategoryResponse,
        message: "Deleted all property category",
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

// add new property category
export async function POST(req) {
  try {
    await connectToDB();
    const formData = await req.formData();
    const propertyCategoryImage = formData.get("image");
    const data = Object.fromEntries(formData.entries());

    let propertyCategoryImageUrl = "";

    // Convert File to base64 and upload to Cloudinary
    if (propertyCategoryImage) {
      propertyCategoryImageUrl = await convertBase64(propertyCategoryImage);
    }

    const propertyCategoryData = {
      name: data?.name,
      image: propertyCategoryImageUrl || "",
      alt: data?.alt,
      title: data?.title,
      featured: data?.featured,
      index: data?.index,
      status: data?.status,
    };

    console.log(propertyCategoryData);
    const newlyCreatedPropertyCategory = await PropertyCategory.create(propertyCategoryData);
    return NextResponse.json(
      {
        success: true,
        data: newlyCreatedPropertyCategory,
        message: "PropertyCategory added successfully",
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

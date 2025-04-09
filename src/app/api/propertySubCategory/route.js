import { convertBase64 } from "@/lib/cloudinary";
import connectToDB from "@/lib/db";
import PropertySubCategory from "@/models/propertySubCategory";
import { NextResponse } from "next/server";
import "@/lib/all-modals";

// fetch all property sub category
export async function GET(req) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Define filter conditionally
    const filter = status ? { status } : {}; // If status exists, filter by status, otherwise fetch all

    // Fetch categories sorted by newest first (createdAt in descending order)
    const fetchpropertySubCategoryData = await PropertySubCategory.find(filter).populate("categoryName").sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: fetchpropertySubCategoryData,
      message: "Fetch property sub category successfully",
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

// delete all property sub category
export async function DELETE() {
  try {
    await connectToDB();
    const deletedPropertySubCategoryResponse = await PropertySubCategory.deleteMany({});
    return NextResponse.json(
      {
        success: true,
        data: deletedPropertySubCategoryResponse,
        message: "Deleted all property sub category",
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

// add new property sub category
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

    const propertySubCategoryData = {
      categoryName: data?.categoryName,
      subCategoryName: data?.subCategoryName,
      image: propertyCategoryImageUrl || "",
      alt: data?.alt,
      title: data?.title,
      featured: data?.featured,
      index: data?.index,
      status: data?.status,
    };

    const newlyCreatedPropertyCategory = await PropertySubCategory.create(propertySubCategoryData);
    return NextResponse.json(
      {
        success: true,
        data: newlyCreatedPropertyCategory,
        message: "PropertySubCategory added successfully",
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

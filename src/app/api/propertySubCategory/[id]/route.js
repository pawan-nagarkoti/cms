import connectToDB from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { convertImagesIntoUrl } from "@/lib/helper";
import "@/lib/all-modals";
import PropertySubCategory from "@/models/propertySubCategory";

// fetch single property sub category on the basis of id
export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing propertysubCategory ID" },
        { status: 400 } // Bad Request
      );
    }

    const propertySubCategoryData = await PropertySubCategory.findById(id).populate("categoryName");

    if (!propertySubCategoryData) {
      return NextResponse.json(
        { success: false, message: "propertysubCategory not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: propertySubCategoryData,
        message: "Data fetched successfully",
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

// delete propertysubCategory on the basis of id
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing property subcategory ID" },
        { status: 400 } // Bad Request
      );
    }

    const deletedPropertySubCategory = await PropertySubCategory.findByIdAndDelete(id); // pass deleted propertysubCategory id

    if (!deletedPropertySubCategory) {
      return NextResponse.json(
        { success: false, message: "propertysubCategory not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json({
      success: true,
      data: deletedPropertySubCategory,
      message: "successfully deleted propertysubCategory",
    });
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

// update propertysubCategory on the basis of ID
export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing propertysubCategory ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Parse the request body
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());
    const propertySubCategoryImageUrl = await convertImagesIntoUrl(data?.image, "image", formData); // this line is used for if we have new image then convert into the URL otherwise return as it is image url.

    const propertySubCategoryData = {
      categoryName: data?.categoryName,
      subCategoryName: data?.subCategoryName,
      image: propertySubCategoryImageUrl || "",
      alt: data?.alt,
      title: data?.title,
      featured: data?.featured,
      index: data?.index,
      status: data?.status,
    };

    const updatedPropertyCategory = await PropertySubCategory.findOneAndUpdate({ _id: id }, propertySubCategoryData, { new: true });

    return NextResponse.json(
      {
        success: true,
        data: updatedPropertyCategory,
        message: "PropertySubCategory updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("update property category error", error.message);
    return NextResponse.json(
      {
        success: false,
        message: error?.message,
      },
      { status: 500 }
    );
  }
}

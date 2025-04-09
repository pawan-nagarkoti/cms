import connectToDB from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { convertImagesIntoUrl } from "@/lib/helper";
import PropertyCategory from "@/models/propertyCategory";

// fetch single propertyCategory on the basis of id
export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing propertyCategory ID" },
        { status: 400 } // Bad Request
      );
    }

    const propertyCategoryData = await PropertyCategory.findById(id);

    if (!propertyCategoryData) {
      return NextResponse.json(
        { success: false, message: "propertyCategory not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: propertyCategoryData,
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

// delete propertyCategory on the basis of id
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing builder ID" },
        { status: 400 } // Bad Request
      );
    }

    const deletedPropertyCategory = await PropertyCategory.findByIdAndDelete(id); // pass deleted propertyCategory id

    if (!deletedPropertyCategory) {
      return NextResponse.json(
        { success: false, message: "propertyCategory not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json({
      success: true,
      data: deletedPropertyCategory,
      message: "successfully deleted propertyCategory",
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

// update propertyCategory on the basis of ID
export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing propertyCategory ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Parse the request body
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());
    const propertyCategoryImageUrl = await convertImagesIntoUrl(data?.image, "image", formData); // this line is used for if we have new image then convert into the URL otherwise return as it is image url.

    const propertyCategoryData = {
      name: data?.name,
      image: propertyCategoryImageUrl || "",
      alt: data?.alt,
      title: data?.title,
      featured: data?.featured,
      index: data?.index,
      status: data?.status,
    };

    const updatedPropertyCategory = await PropertyCategory.findOneAndUpdate({ _id: id }, propertyCategoryData, { new: true });

    return NextResponse.json(
      {
        success: true,
        data: updatedPropertyCategory,
        message: "PropertyCategory updated successfully",
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

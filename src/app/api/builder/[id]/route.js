import connectToDB from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Builder from "@/models/builder";
import { convertImagesIntoUrl } from "@/lib/helper";

// fetch single builder on the basis of id
export async function GET(req, { params }) {
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

    const builder = await Builder.findById(id);

    if (!builder) {
      return NextResponse.json(
        { success: false, message: "builder not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: builder,
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

// delete builder on the basis of id
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

    const deletedBuilder = await Builder.findByIdAndDelete(id); // pass deleted builder id

    if (!deletedBuilder) {
      return NextResponse.json(
        { success: false, message: "builder not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json({
      success: true,
      data: deletedBuilder,
      message: "successfully deleted builder",
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

// update builder on the basis of ID
export async function PUT(req, { params }) {
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

    // ✅ Parse the request body
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());
    const builderImageUrl = await convertImagesIntoUrl(data?.image, "image", formData); // this line is used for if we have new image then convert into the URL otherwise return as it is image url.

    const builderData = {
      name: data?.name,
      image: builderImageUrl || "",
      longDescription: data?.longDescription,
      address: data?.address,
      featured: data?.featured,
      index: data?.index,
      status: data?.status,
    };

    const updatedBuilder = await Builder.findOneAndUpdate({ _id: id }, builderData, { new: true });

    return NextResponse.json(
      {
        success: true,
        data: updatedBuilder,
        message: "Builder updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("update builder error", error.message);
    return NextResponse.json(
      {
        success: false,
        message: error?.message,
      },
      { status: 500 }
    );
  }
}

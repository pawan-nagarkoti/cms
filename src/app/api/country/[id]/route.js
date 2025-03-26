import connectToDB from "@/lib/db";
import Country from "@/models/country";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { convertImagesIntoUrl } from "@/lib/helper";

// fetch single countries
export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing county ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Fetch blog from MongoDB
    const country = await Country.findById(id);

    if (!country) {
      return NextResponse.json(
        { success: false, message: "country not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json(
      { success: true, data: country },
      { status: 200 } // ✅ 200 OK for successful retrieval
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

// delete country on the baisi of id parms
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params; // ✅ Get ID from dynamic route

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing country ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Try deleting the category
    const deletedCountry = await Country.findByIdAndDelete(id);

    if (!deletedCountry) {
      return NextResponse.json(
        { success: false, message: "Country not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json(
      { success: true, message: "Country deleted successfully" },
      { status: 200 } // ✅ 200 OK for successful deletion
    );
  } catch (error) {
    console.error("Error deleting country:", error?.message);
    return NextResponse.json(
      { success: false, message: "Something went wrong! Please try again" },
      { status: 500 } // Internal Server Error
    );
  }
}

// updated country
export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing blog ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Parse the request body
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());
    const countryUrl = await convertImagesIntoUrl(
      data?.image,
      "image",
      formData
    ); // this line is used for if we have new image then convert into the URL otherwise return as it is image url.

    const countryData = {
      name: data?.name,
      image: countryUrl || "",
      abbrevation: data?.abbrevation,
      metaTitle: data?.metaTitle,
      metaDescription: data?.metaDescription,
      metaKeyword: data?.metaKeyword,
      description: data?.description,
    };

    const updatedCountry = await Country.findOneAndUpdate(
      { _id: id },
      countryData,
      { new: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Country updated successfully",
        data: updatedCountry,
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

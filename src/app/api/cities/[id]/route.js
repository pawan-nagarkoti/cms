import connectToDB from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { convertImagesIntoUrl } from "@/lib/helper";
import City from "@/models/cities";

// fetch single city data
export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing city ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Fetch blog from MongoDB
    const city = await City.findById(id);

    if (!city) {
      return NextResponse.json(
        { success: false, message: "city not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json(
      { success: true, data: city },
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

// delte single city
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing city ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Try deleting the category
    const deletedCity = await City.findByIdAndDelete(id);

    if (!deletedCity) {
      return NextResponse.json(
        { success: false, message: "City not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json(
      { success: true, message: "City deleted successfully" },
      { status: 200 } // ✅ 200 OK for successful deletion
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

// update city
export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing city ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Parse the request body
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());
    const cityUrl = await convertImagesIntoUrl(data?.image, "image", formData); // this line is used for if we have new image then convert into the URL otherwise return as it is image url.

    const cityData = {
      name: data?.name,
      image: cityUrl || "",
      abbrevation: data?.abbrevation,
      metaTitle: data?.metaTitle,
      metaDescription: data?.metaDescription,
      metaKeyword: data?.metaKeyword,
      description: data?.description,
    };

    const updatedCity = await City.findOneAndUpdate({ _id: id }, cityData, { new: true });

    return NextResponse.json(
      {
        success: true,
        message: "City updated successfully",
        data: updatedCity,
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

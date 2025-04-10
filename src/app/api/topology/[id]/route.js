import connectToDB from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Topology from "@/models/topology";
import "@/lib/all-modals";

// fetch single topology on the basis of id
export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing topology ID" },
        { status: 400 } // Bad Request
      );
    }

    const topologyData = await Topology.findById(id).populate("propertyCategory");

    if (!topologyData) {
      return NextResponse.json(
        { success: false, message: "topology not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: topologyData,
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

// delete topology on the basis of id
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing topology ID" },
        { status: 400 } // Bad Request
      );
    }

    const deletedTopology = await Topology.findByIdAndDelete(id); // pass deleted topology id

    if (!deletedTopology) {
      return NextResponse.json(
        { success: false, message: "topology not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json({
      success: true,
      data: deletedTopology,
      message: "successfully deleted topology",
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

// update topology on the basis of ID
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

    const topologyData = {
      name: data?.name,
      propertyCategory: data?.propertyCategory,
      longDescription: data?.longDescription,
      featured: data?.featured,
      index: data?.index,
      status: data?.status,
    };

    const updatedTopology = await Topology.findOneAndUpdate({ _id: id }, topologyData, { new: true });

    return NextResponse.json(
      {
        success: true,
        data: updatedTopology,
        message: "Topology updated successfully",
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

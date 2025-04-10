import connectToDB from "@/lib/db";
import Topology from "@/models/topology";
import { NextResponse } from "next/server";
import "@/lib/all-modals";

// fetch all topology
export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Define filter conditionally
    const filter = status ? { status } : {}; // If status exists, filter by status, otherwise fetch all

    const topology = await Topology.find(filter).populate("propertyCategory");
    return NextResponse.json(
      {
        success: true,
        data: topology,
        message: "Fetch topology successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      {
        success: false,
        message: error?.message,
      },
      { status: 500 }
    );
  }
}

// delete all topology
export async function DELETE() {
  try {
    await connectToDB();
    const deletedAllTopology = await Topology.deleteMany({});

    return NextResponse.json(
      {
        success: true,
        data: deletedAllTopology,
        message: "Deleted all topology",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      {
        success: false,
        message: error?.message,
      },
      { status: 500 }
    );
  }
}

// add topology
export async function POST(req) {
  try {
    await connectToDB();
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

    const newlyCreatedTopology = await Topology.create(topologyData);
    return NextResponse.json(
      {
        success: true,
        data: newlyCreatedTopology,
        message: "Topology added successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      {
        success: false,
        message: error?.message,
      },
      { status: 500 }
    );
  }
}

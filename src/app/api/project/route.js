import { convertBase64 } from "@/lib/cloudinary";
import connectToDB from "@/lib/db";
import Project from "@/models/project";
import { NextResponse } from "next/server";
import "@/lib/all-modals"; // It must be add whenever we are using populate method because its serve in the memory

// fetch all projects
export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Define filter conditionally
    const filter = status ? { status } : {}; // If status exists, filter by status, otherwise fetch all

    const project = await Project.find(filter)
      .populate("country")
      .populate("builder")
      .populate("propertyCategory")
      .populate("state")
      .populate("city")
      .sort({ createdAt: 1 });

    return NextResponse.json(
      {
        success: true,
        data: project,
        message: "Fetch project successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error on fetch project", error?.message);
    return NextResponse(
      {
        success: false,
        message: error?.message,
      },
      { status: 500 }
    );
  }
}

// delete all projects
export async function DELETE() {
  try {
    await connectToDB();
    const deletedData = await Project.deleteMany({});

    return NextResponse.json(
      {
        success: true,
        data: deletedData,
        message: "Deleted all Projects",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    const projectData = {
      name: data?.name,
      builder: data?.builder,
      propertyCategory: data?.propertyCategory,
      country: data?.country,
      state: data?.state,
      city: data?.city,
      featured: data?.featured,
      index: data?.index,
      status: data?.status,
    };

    const newlyCreatedProject = await Project.create(projectData);
    return NextResponse.json(
      {
        success: true,
        data: newlyCreatedProject,
        message: "Project added successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

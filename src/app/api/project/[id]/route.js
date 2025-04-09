import connectToDB from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Project from "@/models/project";
import "@/lib/all-modals"; // It must be add whenever we are using populate method because its serve in the memory

// fetch single project
export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing project ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Fetch blog from MongoDB
    const project = await Project.findById(id).populate("country").populate("builder").populate("propertyCategory").populate("state").populate("city");

    if (!project) {
      return NextResponse.json({ success: false, message: "project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: project }, { status: 200 });
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

// delete single project
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params; // ✅ Get ID from dynamic route

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing project ID" },
        { status: 400 } // Bad Request
      );
    }

    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json(
      { success: true, message: "Project deleted successfully" },
      { status: 200 } // ✅ 200 OK for successful deletion
    );
  } catch (error) {
    console.error("Error deleting Project:", error?.message);
    return NextResponse.json(
      { success: false, message: error?.message },
      { status: 500 } // Internal Server Error
    );
  }
}

// update porjects
export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // ✅ Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing project ID" },
        { status: 400 } // Bad Request
      );
    }

    // ✅ Parse the request body
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

    const updatedProject = await Project.findOneAndUpdate({ _id: id }, projectData, { new: true });

    return NextResponse.json(
      {
        success: true,
        message: "Project updated successfully",
        data: updatedProject,
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

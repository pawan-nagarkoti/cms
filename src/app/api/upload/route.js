import { NextResponse } from "next/server";
import { convertBase64 } from "@/lib/cloudinary";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ error: "Invalid file" }, { status: 400 });
    }
    const filename = await convertBase64(file);
    console.log(filename);

    return NextResponse.json(
      {
        success: true,
        url: filename,
        message: "image added successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("image uploadtion error", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong! Please try again",
      },
      { status: 500 }
    );
  }
}

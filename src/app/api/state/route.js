import connectToDB from "@/lib/db";
import State from "@/models/state";
import { NextResponse } from "next/server";

// fetch all states
export async function GET(req) {
  try {
    await connectToDB();
    const state = await State.find({});
    return NextResponse.json(
      {
        success: true,
        data: state,
        message: "Fetch state successfully",
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

// delete all states
export async function DELETE() {
  try {
    await State.deleteMany({});

    return NextResponse.json(
      {
        success: true,
        data: [],
        message: "Deleted all states",
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

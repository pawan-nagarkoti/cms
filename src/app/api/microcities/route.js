import connectToDB from "@/lib/db";
import { NextResponse } from "next/server";
import Microcities from "@/models/microcities";
import State from "@/models/state";
import City from "@/models/cities";
import Country from "@/models/country";

// fetch all microcities
export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const selectedCountryId = searchParams.get("countryId");
    const selectedStateId = searchParams.get("stateId");

    // Define filter conditionally
    const filter = status ? { status } : {}; // If status exists, filter by status, otherwise fetch all

    // get all the active states on the basis of active country
    if (type === "country") {
      const activeStates = await State.find({ activeCountry: selectedCountryId });
      return NextResponse.json({
        success: true,
        data: activeStates,
        message: "Fetched active states on the bais of country id",
      });
    }

    // get all the active city on the basis of active state
    if (type === "state") {
      const activeCity = await City.find({ activeState: selectedStateId });
      return NextResponse.json({
        success: true,
        data: activeCity,
        message: "Fetched active city on the bais of state id",
      });
    }

    const microcities = await Microcities.find(filter);
    return NextResponse.json(
      {
        success: true,
        data: microcities,
        message: "Fetch microcities successfully",
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

// delete all microcities
export async function DELETE() {
  try {
    await Microcities.deleteMany({});

    return NextResponse.json(
      {
        success: true,
        data: [],
        message: "Deleted all Microcities",
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

// add new microcities
export async function POST(req) {
  try {
    await connectToDB();
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    console.log(data?.activeCountry);
    const activeCountryDetail = await Country.findById(data?.activeCountry);
    console.log("ac", activeCountryDetail?.name);

    const microcityData = {
      name: data?.name,
      metaTitle: data?.metaTitle,
      metaDescription: data?.metaDescription,
      metaKeyword: data?.metaKeyword,
      description: data?.description,
      longDescription: data?.longDescription,
      activeCountry: data?.activeCountry,
      activeState: data?.activeState,
      activeCity: data?.activeCity,
      featured: data?.featured,
      index: data?.index,
      status: data?.status,
    };

    const newlyMicrocityCreated = await Microcities.create(microcityData);
    return NextResponse.json(
      {
        success: true,
        data: newlyMicrocityCreated,
        message: "microcity added successfully",
      },
      { status: 201 }
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

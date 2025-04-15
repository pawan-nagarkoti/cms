"use server";

import connectToDB from "@/lib/db";
import Facility from "@/models/facility";
import Faq from "@/models/property/faq-models";
import Floor from "@/models/property/floorPlan-models";
import Gallery from "@/models/property/gallery-models";
import Image from "@/models/property/image-models";
import OtherInformation from "@/models/property/other-information-models";
import Property from "@/models/property/property-models";
import Rera from "@/models/property/rera-models";
import { revalidatePath } from "next/cache";

// fetch property information from the DB(mongo db)
export async function fetchProjectInformation() {
  await connectToDB();
  try {
    const response = await Property.find({});
    if (response) {
      return {
        success: true,
        data: response,
        message: "Property Information Fatched",
      };
    }
  } catch (error) {
    console.log(error?.message);
    return {
      success: false,
      message: error?.message,
    };
  }
}

// other information
export async function otherInformation(formData) {
  try {
    const response = await otherInformation.create(formData);
    console.log("response", response);
  } catch (error) {
    console.log(error?.message);
    return {
      success: false,
      message: error?.message,
    };
  }
}

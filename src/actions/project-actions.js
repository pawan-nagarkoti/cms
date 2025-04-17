"use server";

import connectToDB from "@/lib/db";
import Microcities from "@/models/microcities";
// import Facility from "@/models/facility";
// import Faq from "@/models/property/faq-models";
// import Floor from "@/models/property/floorPlan-models";
// import Gallery from "@/models/property/gallery-models";
// import Image from "@/models/property/image-models";
// import OtherInformation from "@/models/property/other-information-models";
import Property from "@/models/property/property-models";
// import Rera from "@/models/property/rera-models";
import PropertySubCategory from "@/models/propertySubCategory";
import Topology from "@/models/topology";
// import { revalidatePath } from "next/cache";

// Find the property sub-category based on the project category ID, which is retrieved when a project is selected from the project dropdown.
export async function fetchPropertySubCategory(id) {
  await connectToDB();
  try {
    const response = await PropertySubCategory.find({ categoryName: id }).populate("categoryName").lean();
    if (response) {
      return {
        success: true,
        data: response,
        message: "Property Sub Category fatch",
      };
    } else {
      return {
        success: false,
        message: "Property Sub Category not found",
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

// Find the property topology based on the project category ID, which is retrieved when a project is selected from the project dropdown.
export async function fetchPropertyTopology(id) {
  await connectToDB();
  try {
    const response = await Topology.find({ propertyCategory: id }).populate("propertyCategory").lean();
    if (response) {
      return {
        success: true,
        data: response,
        message: "Topology fatched",
      };
    } else {
      return {
        success: false,
        message: "Topology id is not found",
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

// Find the  microcity based on the project city ID, which is retrieved when a project is selected from the project dropdown.
export async function fetchPropertyMicrocity(id) {
  console.log(id);
  await connectToDB();
  try {
    const response = await Microcities.find({ activeCity: id }).populate("activeCity").populate("activeState").populate("activeCountry").lean();
    if (response) {
      return {
        success: true,
        data: response,
        message: "Microcities fatched",
      };
    } else {
      return {
        success: false,
        message: "Microcity id is not found",
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

// add property
export async function addProperty(formData) {
  console.log(formData);
  await connectToDB();
  try {
    const data = {
      projectName: formData.get("projectName"),
      builder: formData.get("builder"),
      address: formData.get("address"),
      propertyTitle: formData.get("propertyTitle"),
      propertySlug: formData.get("propertySlug"),
      priceType: formData.get("priceType"),
      price: formData.get("price"),
      priceUnit: formData.get("priceUnit"),
      minPrice: formData.get("minPrice"),
      minPriceUnit: formData.get("minPriceUnit"),
      maxPrice: formData.get("maxPrice"),
      maxPriceUnit: formData.get("maxPriceUnit"),
      minSize: formData.get("minSize"),
      minSizeUnit: formData.get("minSizeUnit"),
      maxSize: formData.get("maxSize"),
      maxSizeUnit: formData.get("maxSizeUnit"),
      completionOn: formData.get("completionOn"),
      possionNumber: formData.get("possionNumber"),
      possionWMY: formData.get("possionWMY"),
      order: formData.get("order"),
      featuredImage: formData.get("featuredImage"),
      featuredImageTitle: formData.get("featuredImageTitle"),
      featuredImageAlt: formData.get("featuredImageAlt"),
      longDescription: formData.get("longDescription"),
      featured: formData.get("featured") === "true",
      index: formData.get("index") === "true",
      status: formData.get("status") === "true",
      propertySubCategory: JSON.parse(formData.get("propertySubCategory") || "[]"),
      topology: JSON.parse(formData.get("topology") || "[]"),
      microsite: JSON.parse(formData.get("microsite") || "[]"),
      amenties: JSON.parse(formData.get("amenties") || "[]"),
      facility: JSON.parse(formData.get("facility") || "[]"),
      relatedProperties: JSON.parse(formData.get("relatedProperties") || "[]"),
    };

    const response = await Property.create(data);
    console.log("response", response);
    return {
      success: true,
      message: "Property added successfully",
    };
  } catch (error) {
    console.log("Error:", error.message);
    return {
      success: false,
      message: error.message,
    };
  }
}

"use server";

import { convertBase64 } from "@/lib/cloudinary";
import connectToDB from "@/lib/db";
import Microcities from "@/models/microcities";
// import Facility from "@/models/facility";
// import Faq from "@/models/property/faq-models";
// import Floor from "@/models/property/floorPlan-models";
// import Gallery from "@/models/property/gallery-models";
import Image from "@/models/property/image-models";
// import OtherInformation from "@/models/property/other-information-models";
import Property from "@/models/property/property-models";
// import Rera from "@/models/property/rera-models";
import PropertySubCategory from "@/models/propertySubCategory";
import Topology from "@/models/topology";
// import { revalidatePath } from "next/cache";

// common function for convert image file into image url
const convertImagesIntoUrl = async (imageKey, imageName, formData) => {
  try {
    const url = new URL(imageKey);
    if (url.protocol === "http:" || url.protocol === "https:") return imageKey;
  } catch (err) {
    const image = formData.get(imageName);
    if (image) return await convertBase64(image);
  }
};

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
  await connectToDB();

  try {
    const getImage = Object.fromEntries(formData.entries());

    const featuredImage = await convertImagesIntoUrl(getImage?.featuredImage, "featuredImage", formData); // convert image url

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
      featuredImage,
      featuredImageTitle: formData.get("featuredImageTitle"),
      featuredImageAlt: formData.get("featuredImageAlt"),
      longDescription: formData.get("longDescription"),
      featured: JSON.parse(formData.get("featured") || "false"),
      index: JSON.parse(formData.get("index") || "false"),
      status: JSON.parse(formData.get("status") || "false"),

      propertySubCategory: JSON.parse(formData.get("propertySubCategory") || "[]"),
      topology: JSON.parse(formData.get("topology") || "[]"),
      microsite: JSON.parse(formData.get("microsite") || "[]"),
      amenties: JSON.parse(formData.get("amenties") || "[]"),
      facility: JSON.parse(formData.get("facility") || "[]"),
      relatedProperties: JSON.parse(formData.get("relatedProperties") || "[]"),
    };

    const response = await Property.create(data);

    if (response) {
      return {
        success: true,
        data: response.toObject(), // wheever we create the data through server/action , mution you should be use toObject otherwise getting maximum call stack or other errors getting
        message: "Property added successfully",
      };
    } else {
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }
  } catch (error) {
    console.error("Server error:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}

// Add Property image
export async function addPropertyImage(formData) {
  await connectToDB();
  try {
    const getImage = Object.fromEntries(formData.entries()); // get form data after that convert into readble form
    const image = await convertImagesIntoUrl(getImage?.propertyImageTable, "propertyImageTable", formData); // convert image url

    const data = {
      image,
      title: formData.get("propertyTitleTable"),
      alt: formData.get("propertyAltTable"),
    };
    const response = await Image.create(data);
    if (response) {
      return {
        success: true,
        data: response.toObject(),
        message: "Property images added",
      };
    } else {
      return {
        success: false,
        message: "something is wrong",
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
// fetch all property image
export async function fetchPropertyImage() {
  await connectToDB();
  try {
    const response = await Image.find({});
    if (response) {
      return {
        success: true,
        data: response,
      };
    } else {
      return {
        success: false,
        message: "something is wrong",
      };
    }
  } catch (e) {
    console.log(e?.message);
    return {
      success: false,
      message: e?.message,
    };
  }
}
// update property image
// Delete property image
export async function deletePropertyImage(id) {
  await connectToDB();
  try {
    const response = await Image.findByIdAndDelete(id);
    if (response) {
      return {
        success: true,
        data: response,
        message: "Property Image is Delete",
      };
    } else {
      return {
        success: false,
        message: "something is wrong",
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
// edit property image

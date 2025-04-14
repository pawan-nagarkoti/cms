"use server";

import connectToDB from "@/lib/db";
import User from "@/models/user-modal";
import { revalidatePath } from "next/cache";

export async function addNewUser(data) {
  await connectToDB();
  try {
    const newlyCreatedUser = await User.create(data);
    if (newlyCreatedUser) {
      revalidatePath("/dashboard/property/form");
      return {
        success: true,
        message: "user added successfully",
      };
    } else {
      return {
        success: false,
        message: "something went wrong",
      };
    }
  } catch (error) {
    console.log(error.message);
    return {
      success: false,
      message: error?.message,
    };
  }
}

export async function fetchUsers() {
  await connectToDB();
  try {
    const listOfUser = await User.find({});
    if (listOfUser) {
      revalidatePath("/dashboard/property/form");
      return {
        success: true,
        data: JSON.parse(JSON.stringify(listOfUser)),
      };
    } else {
      return {
        success: false,
        message: "something went wrong",
      };
    }
  } catch (error) {
    console.log(error?.message);
    return {
      success: true,
      message: error?.message,
    };
  }
}

export async function deleteUser(id) {
  await connectToDB();
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (deletedUser) {
      revalidatePath("/dashboard/property/form");
      return {
        status: true,
        message: "Deleted successfully",
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

export async function fetchSingleUser(id) {
  await connectToDB();
  try {
    const response = await User.findById(id);
    if (response) {
      return {
        success: true,
        data: response,
        message: "successfully fetched",
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

export async function updateUser(id, formData) {
  await connectToDB();
  try {
    const { name, email, address } = formData;
    const data = await User.findByIdAndUpdate({ _id: id }, { name, email, address }, { new: true });
    return {
      success: true,
      data: data,
      message: "update successfully",
    };
  } catch (error) {
    console.log(error?.message);
    return {
      success: false,
      message: error?.message,
    };
  }
}

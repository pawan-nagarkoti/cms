import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "@/config/constants";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// cloudinary credentials
// export function getCloudinaryInstance() {
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});
// return cloudinary;
// }

// convert to base 64
export async function convertBase64(fileName) {
  const buffer = await fileName.arrayBuffer();
  const base64File = `data:${fileName.type};base64,${Buffer.from(buffer).toString("base64")}`;
  const response = await cloudinary.uploader.upload(base64File, { folder: "cms/blog" });
  const base64Response = response.secure_url;
  return base64Response;
}

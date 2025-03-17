import { v2 as cloudinary } from "cloudinary";

// ✅ Cloudinary Helper Function
export function getCloudinaryInstance() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
}

// ✅ Convert File to Base64 and Upload to Cloudinary
export async function convertBase64(file) {
  if (!file) return null; // Handle null case

  const buffer = await file.arrayBuffer();
  const base64File = `data:${file.type};base64,${Buffer.from(buffer).toString("base64")}`;

  const cloudinary = getCloudinaryInstance(); // Call the helper function
  const response = await cloudinary.uploader.upload(base64File, { folder: "cms/blog" });

  return response.secure_url;
}

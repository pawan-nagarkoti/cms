import { convertBase64 } from "./cloudinary";

export const convertImagesIntoUrl = async (
  imageKey,
  imageName,
  entireFormData
) => {
  try {
    const url = new URL(imageKey);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return imageKey;
    } else {
      throw new Error("Not an HTTP/HTTPS URL");
    }
  } catch (err) {
    const image = entireFormData.get(imageName);
    if (image) {
      const generateUrl = await convertBase64(image);
      return generateUrl;
    }
  }
};

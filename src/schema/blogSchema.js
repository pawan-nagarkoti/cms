import Joi from "joi";

export const BlogSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required and cannot be empty",
  }),
  slug: Joi.string().required().messages({
    "string.empty": "Slug is required and cannot be empty",
  }),
  shortDescription: Joi.string().required().messages({
    "string.empty": "Description is required and cannot be empty",
  }),

  // ✅ Required validation for thumbnailImage (file)
  thumbnailImage: Joi.any().required().messages({
    "any.required": "Thumbnail Image is required",
  }),

  // ✅ Required validation for featuredImage (file)
  featuredImage: Joi.any().required().messages({
    "any.required": "Featured Image is required",
  }),
});

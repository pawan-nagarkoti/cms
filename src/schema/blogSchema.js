import Joi from "joi";

export const AddNewBlogSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required and cannot be empty",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required and cannot be empty",
  }),
});

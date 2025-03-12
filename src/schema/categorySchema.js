import Joi from "joi";

export const CategorySchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Category name is required",
  }),
  index: Joi.boolean().required().messages({
    "any.required": "Index is required",
    "boolean.base": "Index must be true or false",
  }),
  status: Joi.boolean().required().messages({
    "any.required": "Status is required",
    "boolean.base": "Status must be true or false",
  }),
});

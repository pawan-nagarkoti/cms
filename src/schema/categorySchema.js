import Joi from "joi";

export const CategorySchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Category name is requrired",
  }),
  index: Joi.string().required().messages({
    "string.empty": "Index name is requrired",
  }),
  status: Joi.string().required().messages({
    "string.empty": "status name is requrired",
  }),
});

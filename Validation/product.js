import Joi from "joi";

export const ValidateProduct = (productData) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().positive().required(),
    description: Joi.string(),
    category: Joi.string(),
    // Add other properties and validations as needed
  });

  return schema.validateAsync(productData);
};
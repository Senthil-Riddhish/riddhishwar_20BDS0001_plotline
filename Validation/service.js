import Joi from "joi";

export const ValidateService = (serviceData) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().positive().required(),
    description: Joi.string(),
    duration: Joi.number().positive(),
    // Add other properties and validations as needed
  });

  return schema.validateAsync(serviceData);
};

import joi from "joi";

//validating Items before inserting into the cart
export const ValidateCartItem = (itemData) => {
  const schema = joi.object({
    itemType: joi.string().valid("product", "service").required(),
    itemId: joi.string().required(), // Assuming the ID is a string
    quantity: joi.number().integer().min(1).required(),
  });

  return schema.validateAsync(itemData);
};

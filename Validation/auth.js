import joi from "joi";

//Validating User/Admin details during Signup
export const ValidateSignup = (userData) => {
  const Schema = joi.object({
    fullName: joi.string().required().min(5),
    email: joi.string().email().required(),
    password: joi.string().required(),
    phoneNumber: joi.number().required(),
    role: joi.string().valid("admin", "user")
  });

  return Schema.validateAsync(userData);
};

//Validating User/Admin details during Signin
export const ValidateSignin = (userData) => {
  const Schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  return Schema.validateAsync(userData);
};
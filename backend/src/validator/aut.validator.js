const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),

  email: Joi.string().email().required(),

  password: Joi.string()
    .min(8)
    .max(20)
    .required()
    .messages({
        "string.min": "Password must be at least 8 characters",
        "string.max": "Password cannot exceed 20 characters"
    })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
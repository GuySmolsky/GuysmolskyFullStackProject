import Joi from "joi";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d{4,})(?=.*[@$!%*#?&^_-])[A-Za-z\d@$!%*#?&^_-]{8,}$/;

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passwordRegex).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  role: Joi.string().valid("jobseeker", "employer").default("jobseeker"),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Validation error",
          details: error.details.map((detail) => detail.message),
        },
      });
    }
    next();
  };
};

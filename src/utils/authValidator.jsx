import Joi from 'joi';

const loginSchema = Joi.object({
  identity: Joi.string().required().messages({
    'string.empty': 'Username or Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
});

const registerSchema = Joi.object({
  firstName: Joi.string().required().messages({
    'string.empty': 'First Name is required',
  }),
  lastName: Joi.string().required().messages({
    'string.empty': 'Last Name is required',
  }),
  identity: Joi.string().required().messages({
    'string.empty': 'Email or Username is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'string.empty': 'Confirm Password is required',
    'any.only': 'Confirm Password must match Password',
  }),
});

export { loginSchema, registerSchema };

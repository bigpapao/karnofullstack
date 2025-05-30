import { handleError } from '../utils/errorHandler.js';
import Joi from 'joi';
import { ApiError, ErrorCodes } from '../utils/api-error.js';

// Joi validation schema for user registration
const registerSchema = Joi.object({
  firstName: Joi.string().min(3).max(50).required()
    .messages({
      'string.min': 'نام باید حداقل 3 کاراکتر باشد',
      'string.max': 'نام نباید بیشتر از 50 کاراکتر باشد',
      'any.required': 'نام الزامی است'
    }),
  lastName: Joi.string().min(3).max(50).required()
    .messages({
      'string.min': 'نام خانوادگی باید حداقل 3 کاراکتر باشد',
      'string.max': 'نام خانوادگی نباید بیشتر از 50 کاراکتر باشد',
      'any.required': 'نام خانوادگی الزامی است'
    }),
  mobile: Joi.string().pattern(/^09\d{9}$/).messages({
    'string.pattern.base': 'شماره موبایل باید 11 رقم و با فرمت 09XXXXXXXXX باشد'
  }),
  email: Joi.string().pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).messages({
    'string.pattern.base': 'فرمت ایمیل نامعتبر است'
  }),
  password: Joi.string().min(8).pattern(/.*[0-9].*/).required()
    .messages({
      'string.min': 'رمز عبور باید حداقل 8 کاراکتر باشد',
      'string.pattern.base': 'رمز عبور باید حداقل شامل یک عدد باشد',
      'any.required': 'رمز عبور الزامی است'
    }),
  sessionId: Joi.string().allow('', null),
  name: Joi.string().allow('', null), // For backward compatibility
  role: Joi.string().valid('user', 'admin').default('user'),
  phone: Joi.string().pattern(/^09\d{9}$/).messages({
    'string.pattern.base': 'شماره موبایل باید 11 رقم و با فرمت 09XXXXXXXXX باشد'
  })
}).or('email', 'mobile', 'phone').messages({
  'object.missing': 'حداقل یکی از فیلدهای ایمیل یا شماره موبایل باید وارد شود'
});

// Middleware for validating user registration
export const validateRegistration = (req, res, next) => {
  console.log('Registration request body:', req.body);
  const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      msg: detail.message
    }));
    
    return res.status(422).json({
      status: 'error',
      message: 'خطا در اعتبارسنجی اطلاعات',
      errors
    });
  }
  
  // If validation passes, attach the validated data to the request
  req.validatedData = value;
  next();
};

export const validateProduct = (req, res, next) => {
  const {
    name, description, price, category, brand, sku,
  } = req.body;

  if (!name) {
    return next(handleError(400, 'Product name is required'));
  }

  if (!description) {
    return next(handleError(400, 'Product description is required'));
  }

  if (!price || price < 0) {
    return next(handleError(400, 'Valid product price is required'));
  }

  if (!category) {
    return next(handleError(400, 'Product category is required'));
  }

  if (!brand) {
    return next(handleError(400, 'Product brand is required'));
  }

  if (!sku) {
    return next(handleError(400, 'Product SKU is required'));
  }

  next();
};

export const validateOrder = (req, res, next) => {
  const { shippingAddress, paymentMethod } = req.body;

  if (!shippingAddress) {
    return next(handleError(400, 'Shipping address is required'));
  }

  const {
    fullName, address, city, state, zipCode, country, phone,
  } = shippingAddress;

  if (!fullName) {
    return next(handleError(400, 'Full name is required'));
  }

  if (!address) {
    return next(handleError(400, 'Address is required'));
  }

  if (!city) {
    return next(handleError(400, 'City is required'));
  }

  if (!state) {
    return next(handleError(400, 'State is required'));
  }

  if (!zipCode) {
    return next(handleError(400, 'ZIP code is required'));
  }

  if (!country) {
    return next(handleError(400, 'Country is required'));
  }

  if (!phone) {
    return next(handleError(400, 'Phone number is required'));
  }

  if (!paymentMethod) {
    return next(handleError(400, 'Payment method is required'));
  }

  const validPaymentMethods = ['stripe', 'paypal', 'credit_card'];
  if (!validPaymentMethods.includes(paymentMethod)) {
    return next(handleError(400, 'Invalid payment method. Must be one of: stripe, paypal, credit_card'));
  }

  next();
};

/**
 * Request validation middleware using Joi
 * @param {Object} schema - Joi validation schema
 * @param {string} [property='body'] - Request property to validate (body, query, params)
 * @returns {Function} Express middleware
 */
export const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    console.log(`Validating ${property}:`, req[property]);
    
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });

    if (!error) {
      // Replace the original data with validated/sanitized data
      req[property] = value;
      next();
      return;
    }

    console.log('Validation error details:', error.details);

    const validationErrors = error.details.map(detail => ({
      field: detail.path.join('.'),
      msg: detail.message
    }));

    const errorMessage = error.details
      .map(detail => detail.message)
      .join(', ');

    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: validationErrors,
      details: errorMessage
    });
  };
};

// Common validation schemas
export const schemas = {
  // Auth schemas
  login: Joi.object({
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^09\d{9}$/),
    password: Joi.string().min(6).required()
  }).or('email', 'phone')
    .messages({
      'object.missing': 'Either email or phone number must be provided'
    }),

  register: Joi.object({
    firstName: Joi.string().min(2).max(50).required()
      .messages({
        'string.min': 'First name must be at least 2 characters long',
        'string.max': 'First name cannot exceed 50 characters',
        'any.required': 'First name is required'
      }),
    lastName: Joi.string().min(2).max(50).required()
      .messages({
        'string.min': 'Last name must be at least 2 characters long',
        'string.max': 'Last name cannot exceed 50 characters',
        'any.required': 'Last name is required'
      }),
    email: Joi.string().email().optional()
      .messages({
        'string.email': 'Please provide a valid email address'
      }),
    phone: Joi.string().pattern(/^09\d{9}$/).optional()
      .messages({
        'string.pattern.base': 'Phone number must be in format 09XXXXXXXXX'
      }),
    password: Joi.string().min(6).required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
      })
  }).or('email', 'phone')
  .messages({
    'object.missing': 'Either email or phone number must be provided'
  })
  .unknown(false),

  // Product schemas
  createProduct: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().required(),
    brand: Joi.string().required(),
    stock: Joi.number().integer().min(0).required(),
    images: Joi.array().items(Joi.string().uri()).min(1).required()
  }),

  updateProduct: Joi.object({
    name: Joi.string().min(3).max(100),
    description: Joi.string().min(10).max(1000),
    price: Joi.number().min(0),
    category: Joi.string(),
    brand: Joi.string(),
    stock: Joi.number().integer().min(0),
    images: Joi.array().items(Joi.string().uri())
  }),

  // Order schemas
  createOrder: Joi.object({
    items: Joi.array().items(
      Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required()
      })
    ).min(1).required(),
    shippingAddress: Joi.string().required(),
    paymentMethod: Joi.string().valid('online', 'cash').required()
  }),

  // Address schemas
  createAddress: Joi.object({
    title: Joi.string().min(2).max(50).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    phone: Joi.string().pattern(/^[0-9]{10,11}$/).required(),
    province: Joi.string().required(),
    city: Joi.string().required(),
    address: Joi.string().min(10).max(200).required(),
    postalCode: Joi.string().pattern(/^[0-9]{10}$/).required(),
    isDefault: Joi.boolean()
  }),

  // Search schemas
  search: Joi.object({
    query: Joi.string().min(2).max(100).required(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().valid('price', '-price', 'createdAt', '-createdAt'),
    filters: Joi.object({
      category: Joi.string(),
      brand: Joi.string(),
      minPrice: Joi.number().min(0),
      maxPrice: Joi.number().min(0),
      inStock: Joi.boolean()
    })
  })
};

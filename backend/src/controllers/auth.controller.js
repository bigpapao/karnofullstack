import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.model.js';
import PhoneVerification from '../models/phoneVerification.model.js';
import { AppError } from '../middleware/error-handler.middleware.js';
import { sendSmsVerification } from '../utils/sms.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  setTokenCookies,
  clearTokenCookies,
} from '../utils/tokens.js';

// Legacy token generation (kept for backward compatibility)
// eslint-disable-next-line no-unused-vars
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
});

// Create and send token with secure cookie
const createSendToken = (user, statusCode, req, res) => {
  // Generate both access and refresh tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Set cookies
  setTokenCookies(res, accessToken, refreshToken);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token: accessToken, // For backward compatibility
    data: {
      user,
    },
  });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    console.log('Registration request received:', {
      body: req.body,
      timestamp: new Date().toISOString()
    });

    const { firstName, lastName, email, phone, password } = req.body;

    // Input validation
    if (!firstName || !lastName || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'First name, last name, and password are required.',
        errors: [
          { field: 'firstName', msg: 'First name is required' },
          { field: 'lastName', msg: 'Last name is required' },
          { field: 'password', msg: 'Password is required' }
        ].filter(err => 
          (err.field === 'firstName' && !firstName) ||
          (err.field === 'lastName' && !lastName) ||
          (err.field === 'password' && !password)
        )
      });
    }

    // Email or phone validation - at least one is required
    if (!email && !phone) {
      return res.status(400).json({
        status: 'error',
        message: 'Either email or phone number is required.',
        errors: [{ field: 'email', msg: 'Either email or phone number must be provided' }]
      });
    }

    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 6 characters long',
        errors: [{ field: 'password', msg: 'Password must be at least 6 characters long' }]
      });
    }

    // Email format validation (if provided)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid email format',
        errors: [{ field: 'email', msg: 'Please provide a valid email address' }]
      });
    }

    // Phone format validation (if provided) - Iranian mobile format
    if (phone && !/^09\d{9}$/.test(phone)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid phone number format',
        errors: [{ field: 'phone', msg: 'Phone number must be in format 09XXXXXXXXX' }]
      });
    }

    // Check for existing user with same email or phone
    const existingUserQuery = {};
    if (email) existingUserQuery.email = email.toLowerCase().trim();
    if (phone) existingUserQuery.phone = phone.trim();

    const existingUser = await User.findOne({
      $or: Object.keys(existingUserQuery).map(key => ({ [key]: existingUserQuery[key] }))
    });

    if (existingUser) {
      const conflictField = email && existingUser.email === email.toLowerCase().trim() ? 'email' : 'phone';
      const conflictValue = conflictField === 'email' ? 'email address' : 'phone number';
      
      return res.status(409).json({
        status: 'error',
        message: `An account with this ${conflictValue} already exists.`,
        errors: [{ 
          field: conflictField, 
          msg: `This ${conflictValue} is already registered. Please use a different ${conflictValue} or try logging in.` 
        }]
      });
    }

    // Create user data object
    const userData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      password: password // Will be hashed by pre-save middleware
    };

    // Add email if provided
    if (email) {
      userData.email = email.toLowerCase().trim();
    }

    // Add phone if provided
    if (phone) {
      userData.phone = phone.trim();
    }

    console.log('Creating user with data:', {
      ...userData,
      password: '[REDACTED]'
    });

    // Create new user
    const user = await User.create(userData);

    console.log('User created successfully:', {
      id: user._id,
      email: user.email,
      phone: user.phone,
      timestamp: new Date().toISOString()
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set secure HTTP-only cookies
    setTokenCookies(res, accessToken, refreshToken);

    // Remove sensitive data from response
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      phoneVerified: user.phoneVerified,
      verificationStatus: user.verificationStatus,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: userResponse
      },
      token: accessToken // For frontend compatibility
    });

  } catch (error) {
    console.error('Registration error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        msg: err.message
      }));

      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Handle duplicate key errors (MongoDB error code 11000)
    if (error.code === 11000) {
      let field = 'field';
      let message = 'Duplicate entry';

      if (error.keyPattern) {
        if (error.keyPattern.email) {
          field = 'email';
          message = 'An account with this email already exists';
        } else if (error.keyPattern.phone) {
          field = 'phone';
          message = 'An account with this phone number already exists';
        }
      }

      return res.status(409).json({
        status: 'error',
        message,
        errors: [{ field, msg: message }]
      });
    }

    // Handle other errors
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error during registration',
      ...(process.env.NODE_ENV === 'development' && { 
        error: error.message,
        stack: error.stack 
      })
    });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if we have email and password
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password',
      });
    }

    // Find user by email and include password field
    const user = await User.findOne({ email }).select('+password +passwordResetAttempts +accountLocked +lockUntil');

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    // Check if account is locked
    if (user.accountLocked && user.lockUntil && user.lockUntil > Date.now()) {
      const lockTimeRemaining = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
      return res.status(423).json({
        status: 'error',
        message: `Account temporarily locked. Try again in ${lockTimeRemaining} minutes`,
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password, user.password);

    if (!isPasswordCorrect) {
      // Increment failed attempts
      user.passwordResetAttempts = (user.passwordResetAttempts || 0) + 1;

      // Lock account after 5 failed attempts for 15 minutes
      if (user.passwordResetAttempts >= 5) {
        user.accountLocked = true;
        user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
      }

      await user.save({ validateBeforeSave: false });

      if (user.accountLocked) {
        return res.status(423).json({
          status: 'error',
          message: 'Too many failed login attempts. Account locked for 15 minutes',
        });
      }

      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    // Reset failed attempts on successful login
    if (user.passwordResetAttempts > 0) {
      user.passwordResetAttempts = 0;
      user.accountLocked = false;
      user.lockUntil = undefined;
      await user.save({ validateBeforeSave: false });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken);

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Public
export const logout = (req, res) => {
  clearTokenCookies(res);
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
};

// @desc    Refresh token
// @route   POST /api/v1/auth/refresh-token
// @access  Public
export const refreshToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.cookies;

    if (!refresh_token) {
      return res.status(401).json({
        status: 'error',
        message: 'No refresh token provided',
      });
    }

    const decoded = verifyRefreshToken(refresh_token);
    if (!decoded) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid refresh token',
      });
    }

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Generate new tokens
    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Set new cookies
    setTokenCookies(res, accessToken, newRefreshToken);

    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/v1/auth/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Legacy exports for backward compatibility (if needed)
export const verifyEmail = async (req, res, next) => {
  res.status(501).json({
    status: 'error',
    message: 'Email verification not implemented in simplified auth',
  });
};

export const requestPhoneVerification = async (req, res, next) => {
  res.status(501).json({
    status: 'error',
    message: 'Phone verification moved to user routes',
  });
};

export const verifyPhoneAndLogin = async (req, res, next) => {
  res.status(501).json({
    status: 'error',
    message: 'Phone verification moved to user routes',
  });
};

export const forgotPassword = async (req, res, next) => {
  res.status(501).json({
    status: 'error',
    message: 'Password reset not implemented in simplified auth',
  });
};

export const resetPassword = async (req, res, next) => {
  res.status(501).json({
    status: 'error',
    message: 'Password reset not implemented in simplified auth',
  });
};

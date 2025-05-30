import crypto from 'crypto';
import User from '../models/user.model.js';
import { AppError } from '../middleware/error-handler.middleware.js';
import {
  generateAccessToken,
  generateRefreshToken,
  setTokenCookies,
} from '../utils/tokens.js';
import { sendEmail } from '../utils/email.js';

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    // User is already attached to req from auth middleware
    res.status(200).json({
      status: 'success',
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const {
      firstName, lastName, email, address, password, phone,
    } = req.body;

    // Get user from auth middleware or find by phone (for password setup)
    let user;
    if (req.user) {
      user = await User.findById(req.user.id);
    } else if (phone) {
      // This path is used for setting password after phone verification
      user = await User.findOne({ phone });
    }

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Update basic info
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    // Update email if provided and different
    if (email && email !== user.email) {
      // Check if email already exists for another user
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        return next(new AppError('Email already in use by another account', 400));
      }

      user.email = email;
      user.isEmailVerified = false; // Reset email verification
    }

    // Update password if provided
    if (password) {
      if (password.length < 6) {
        return next(new AppError('Password must be at least 6 characters', 400));
      }
      user.password = password;
    }

    // Update address if provided
    if (address) {
      user.address = {
        ...user.address,
        ...address,
      };
    }

    await user.save({ validateBeforeSave: true });

    // Remove sensitive fields
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

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Get user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('There is no user with that email address', 404));
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Use a fixed frontend URL for development. In production, use an environment variable.
    const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetURL = `${frontendBaseUrl}/reset-password/${resetToken}`;

    const message = `Forgot your password? Click the link to reset your password: ${resetURL}
This link is valid for 10 minutes.
If you didn\'t forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 minutes)',
        html: message,
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email',
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new AppError('There was an error sending the email. Try again later!', 500));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // Hash token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user by token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Generate tokens and set cookies
    const accessToken = generateAccessToken(user);
    const refreshTokenToSet = generateRefreshToken(user); // Renamed to avoid conflict
    setTokenCookies(res, accessToken, refreshTokenToSet);

    res.status(200).json({
      status: 'success',
      token: accessToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

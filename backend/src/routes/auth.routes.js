import express from 'express';
import rateLimit from 'express-rate-limit';
import { validateRequest, schemas } from '../middleware/validation.middleware.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  login,
  register,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
} from '../controllers/auth.controller.js';

const router = express.Router();

// Rate limiter for login route - 5 requests per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many login attempts, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.post('/register', validateRequest(schemas.register), asyncHandler(register));
router.post('/login', loginLimiter, validateRequest(schemas.login), asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.post('/refresh-token', asyncHandler(refreshToken));

// Protected routes
router.use(authenticate);
router.get('/profile', asyncHandler(getProfile));
router.put('/profile', asyncHandler(updateProfile));

export default router;

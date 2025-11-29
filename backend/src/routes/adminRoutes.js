import express from 'express';
import {
  getSiteStats,
  getAllUsers,
} from '../controllers/admin.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js'; // Correct import path

const router = express.Router();

// Middleware to check for admin role
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

// All admin routes should be protected and require admin role
router.use(isAuthenticated, isAdmin);

router.get('/stats', getSiteStats);
router.get('/users', getAllUsers);

export default router;
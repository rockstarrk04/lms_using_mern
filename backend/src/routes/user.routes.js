import express from 'express';
import { updatePassword, updateProfile } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js'; // Assuming you have this middleware

const router = express.Router();

// This route is protected, meaning only logged-in users can access it.
router.put('/update-password', isAuthenticated, updatePassword);
router.put('/update-profile', isAuthenticated, updateProfile);

export default router;
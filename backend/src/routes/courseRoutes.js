import express from 'express';
import {
  getAllCourses,
  getCourseById,
  getMyCreatedCourses,
  createCourse,
  updateCourse,
  getCourseForEnrolledUser,
  getRazorpayKey,
} from '../controllers/course.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js'; // Correct import path

const router = express.Router();

// --- Public Routes ---
router.get('/', getAllCourses);
router.get('/:courseId', getCourseById);

// --- Protected Routes ---
router.get('/my-creations', isAuthenticated, getMyCreatedCourses);
router.post('/', isAuthenticated, createCourse);
router.put('/:courseId', isAuthenticated, updateCourse);
router.get('/learn/:courseId', isAuthenticated, getCourseForEnrolledUser);

// This could be a protected route as well, depending on your logic
router.get('/get-razorpay-key', getRazorpayKey);

export default router;
// backend/src/routes/enrollmentRoutes.js
import express from "express";
const router = express.Router();

import {
  getMyEnrollments,
  enrollInCourse,
  getEnrollmentById,
} from "../controllers/enrollmentController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

// -----------------------------------------------------------------
//  Enrollment Routes
// -----------------------------------------------------------------

// GET /api/enrollments/me - Get all enrollments of current student
router.get("/me", protect, allowRoles("student"), getMyEnrollments);

// GET /api/enrollments/:id - Get a single enrollment record
router.get("/:id", protect, allowRoles("student"), getEnrollmentById);

// POST /api/enrollments/:courseId/enroll - Enroll in a course
router.post("/:courseId/enroll", protect, allowRoles("student"), enrollInCourse);

export default router;

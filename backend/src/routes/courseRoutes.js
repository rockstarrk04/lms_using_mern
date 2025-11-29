// backend/src/routes/courseRoutes.js

import express from "express";

// --- Controllers ---
import {
  getCourses,
  getCourseById,
  createCourse,
  getMyCourses,
  deleteCourse,
  updateCourse,
} from "../controllers/courseController.js";

import {
  getLessonsForCourse,
  createLessonForCourse,
} from "../controllers/lessonController.js";

// --- Middleware ---
import { protect } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// ---------------------------------------------------------
// 📚 PUBLIC ROUTES
// ---------------------------------------------------------

// Get all published courses
router.get("/", getCourses);

// ⚠️ Important: Define static routes BEFORE dynamic routes (/:id)
router.get("/mine", protect, allowRoles("instructor", "admin"), getMyCourses);

// ---------------------------------------------------------
// 📚 PUBLIC LESSON ROUTES
// ---------------------------------------------------------

// Get all lessons for a specific course
router.get("/:courseId/lessons", getLessonsForCourse);

// ---------------------------------------------------------
// 📚 PUBLIC SINGLE COURSE
// ---------------------------------------------------------

// Get a specific course by ID
router.get("/:id", getCourseById);

// ---------------------------------------------------------
// 🔐 PROTECTED ROUTES
// ---------------------------------------------------------

// Student enrolls in a course
// router.post(
//   "/:courseId/enroll",
//   protect,
//   allowRoles("student"),
//   enrollInCourse
// );

// ---------------------------------------------------------
// 💼 INSTRUCTOR / ADMIN ROUTES
// ---------------------------------------------------------

// Create new course
router.post(
  "/",
  protect,
  allowRoles("instructor", "admin"),
  createCourse
);

// Create lesson for a course
router.post(
  "/:courseId/lessons",
  protect,
  allowRoles("instructor", "admin"),
  createLessonForCourse
);

// Update a course
router.put(
  "/:id",
  protect,
  allowRoles("instructor", "admin"),
  updateCourse
);

// ---------------------------------------------------------
// 👑 ADMIN ONLY
// ---------------------------------------------------------

// Delete a course
router.delete(
  "/:id",
  protect,
  allowRoles("instructor", "admin"),
  deleteCourse
);

export default router;

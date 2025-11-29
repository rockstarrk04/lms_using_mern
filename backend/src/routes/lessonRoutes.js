// backend/src/routes/lessonRoutes.js

import express from "express";
const router = express.Router();

// Controllers
import { getLessonById } from "../controllers/lessonController.js";

// Middleware
import { protect } from "../middlewares/authMiddleware.js";
// const { allowRoles } = require("../middlewares/roleMiddleware"); // optional

// -----------------------------------------------------------
// LESSON ROUTES
// -----------------------------------------------------------

// GET /api/lessons/:id
// Fetch a single lesson by ID
router.get("/:id", protect, getLessonById);

// ✔ If you decide later that only enrolled students can view lessons,
// you can replace with:
// router.get("/:id", protect, allowRoles("student", "instructor", "admin"), getLessonById);

export default router;

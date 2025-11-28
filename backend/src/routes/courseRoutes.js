// backend/src/routes/courseRoutes.js
const express = require("express");
const router = express.Router();

const {
  getCourses,
  getCourseById,
  createCourse,
} = require("../controllers/courseController");

const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

// PUBLIC
router.get("/", getCourses);
router.get("/:id", getCourseById);

// PROTECTED: only instructor or admin can create
router.post("/", protect, allowRoles("instructor", "admin"), createCourse);

module.exports = router;

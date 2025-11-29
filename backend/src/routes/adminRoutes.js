import express from "express";

import {
  getAllUsers,
  toggleBlockUser,
  getAllCourses,
  deleteCourse,
  createCourseAsAdmin,
  getAllInstructors,
  getCourseByIdAsAdmin,
  toggleApproveCourse,
} from "../controllers/adminController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(allowRoles("admin"));

router.get("/users", getAllUsers);
router.patch("/users/:id/block", toggleBlockUser);

router.get("/instructors", getAllInstructors);
router.get("/courses", getAllCourses);
router.post("/courses", createCourseAsAdmin);
router.get("/courses/:id", getCourseByIdAsAdmin);
router.patch("/courses/:id/approve", toggleApproveCourse);
router.delete("/courses/:id", deleteCourse);

export default router;

// backend/src/controllers/adminController.js

import * as UserService from "../services/userService.js";
import * as CourseService from "../services/courseService.js";

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await UserService.findUsers(page, limit);

    return res.json(result);
  } catch (error) {
    console.error("getAllUsers error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/admin/users/:id/block
export const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { block } = req.body;

    const user = await UserService.findUserById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const updatedUser = await UserService.updateUserBlockStatus(user, block);

    return res.json({
      message: block ? "User blocked" : "User unblocked",
      user: updatedUser,
    });
  } catch (error) {
    console.error("toggleBlockUser error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/courses/:id
export const getCourseByIdAsAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    // Admin can see any course, including unapproved or soft-deleted ones
    const course = await CourseService.findCourseById(id); // Corrected from UserService

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.json({ course });
  } catch (error) {
    console.error("getCourseByIdAsAdmin error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/admin/courses/:id/approve
export const toggleApproveCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const course = await CourseService.findCourseById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const updatedCourse = await CourseService.updateCourseApprovalStatus(
      course,
      isApproved
    );

    return res.json({
      message: isApproved ? "Course approved" : "Course unapproved",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error in toggleApproveCourse:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/instructors
export const getAllInstructors = async (req, res) => {
  try {
    const instructors = await UserService.findAllInstructors();
    return res.json({ instructors });
  } catch (error) {
    console.error("getAllInstructors error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/courses
export const getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await CourseService.findAllCourses(page, limit);

    return res.json(result);
  } catch (error) {
    console.error("getAllCourses error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/admin/courses
export const createCourseAsAdmin = async (req, res) => {
  try {
    if (!req.body.title || !req.body.description || !req.body.instructor) {
      return res
        .status(400)
        .json({ message: "Title, description, and instructor are required" });
    }

    const course = await CourseService.createAdminCourse(req.body);

    return res.status(201).json({
      message: "Course created successfully by admin",
      course,
    });
  } catch (error) {
    console.error("createCourseAsAdmin error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/admin/courses/:id
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCourse = await CourseService.softDeleteCourseById(id);
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("deleteCourse error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

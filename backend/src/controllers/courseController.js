// backend/src/controllers/courseController.js

import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

// GET /api/courses  -> list all approved courses
export const getCourses = async (req, res) => {
  try {
    const { search, category, level } = req.query;

    const query = { isApproved: true, isDeleted: { $ne: true } };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category) query.category = category;
    if (level) query.level = level;

    const courses = await Course.find(query)
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    return res.json({ courses });
  } catch (error) {
    console.error("getCourses error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/courses/mine
export const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      instructor: req.user._id,
      isDeleted: { $ne: true },
    }).sort({ createdAt: -1 });

    return res.json({ courses });
  } catch (error) {
    console.error("getMyCourses error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/courses/:id
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, isDeleted: { $ne: true } }).populate(
      "instructor", "name email"
    );

    // Allow admin to see any course, others can only see approved ones
    const isAdmin = req.user?.role === 'admin';

    if (!course || (!course.isApproved && !isAdmin)) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.json({ course });
  } catch (error) {
    console.error("getCourseById error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/courses
export const createCourse = async (req, res) => {
  try {
    // Only instructors/admins
    if (!["admin", "instructor"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only instructors and admins can create courses",
      });
    }

    const {
      title,
      description,
      category,
      level,
      language,
      thumbnailUrl,
      price,
    } = req.body || {};

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const course = await Course.create({
      title,
      description,
      category,
      level,
      language,
      thumbnailUrl,
      price,
      instructor: req.user._id,
    });

    return res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("createCourse error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// UPDATE COURSE
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      level,
      language,
      thumbnailUrl,
      price,
      isApproved,
    } = req.body;

    const course = await Course.findOne({ _id: id, isDeleted: { $ne: true } });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Only admin or owner
    if (
      req.user.role !== "admin" &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not authorized to update this course",
      });
    }

    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (level) course.level = level;
    if (language) course.language = language;
    if (thumbnailUrl) course.thumbnailUrl = thumbnailUrl;
    if (price !== undefined) course.price = price;

    if (req.user.role === "admin" && isApproved !== undefined) {
      course.isApproved = isApproved;
    }

    const updatedCourse = await course.save();

    return res.json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("updateCourse error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE COURSE (Instructor + Admin)
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findOne({ _id: id, isDeleted: { $ne: true } });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Allow only: admin OR the instructor who created it
    if (
      req.user.role !== "admin" &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this course" });
    }

    // Delete all enrollments for that course
    // await Enrollment.deleteMany({ course: id }); // With soft delete, you might not want to delete enrollments

    course.isDeleted = true;
    await course.save();

    return res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("deleteCourse error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

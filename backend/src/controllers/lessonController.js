// backend/src/controllers/lessonController.js
import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

// GET /api/courses/:courseId/lessons
export const getLessonsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const lessons = await Lesson.find({ course: courseId })
      .sort({ order: 1, createdAt: 1 });

    return res.json({ lessons });
  } catch (error) {
    console.error("getLessonsForCourse error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/courses/:courseId/lessons  (instructor/admin only)
export const createLessonForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, content, videoUrl, order } = req.body || {};

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Ensure course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Only allow course instructor or admin to add lessons
    if (
      req.user.role !== "admin" &&
      course.instructor?.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You are not allowed to add lessons to this course" });
    }

    const lesson = await Lesson.create({
      course: courseId,
      title,
      description,
      content,
      videoUrl,
      order: order ?? 0,
    });

    return res.status(201).json({
      message: "Lesson created successfully",
      lesson,
    });
  } catch (error) {
    console.error("createLessonForCourse error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/lessons/:id
export const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate(
      "course",
      "title instructor"
    );

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // --- SECURITY CHECK ---
    // Allow access if:
    // 1. User is an admin
    // 2. User is the instructor of the course
    // 3. User is enrolled in the course
    const isEnrolled = await Enrollment.findOne({
      student: req.user._id,
      course: lesson.course._id,
    });

    const isInstructor = lesson.course.instructor?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isEnrolled && !isInstructor && !isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to view this lesson",
      });
    }

    return res.json({ lesson });
  } catch (error) {
    console.error("getLessonById error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// backend/src/controllers/enrollmentController.js
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

// POST /api/courses/:courseId/enroll  (student)
export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course || !course.isApproved) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existing = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "You are already enrolled in this course" });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
    });

    return res.status(201).json({
      message: "Enrolled successfully",
      enrollment,
    });
  } catch (error) {
    console.error("enrollInCourse error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/enrollments/me  (student)
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id,
    })
      .populate("course", "title description thumbnailUrl")
      .sort({ createdAt: -1 });

    return res.json({ enrollments });
  } catch (error) {
    console.error("getMyEnrollments error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/enrollments/:id (student)
export const getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      student: req.user._id,
    }).populate("course", "title description thumbnailUrl");

    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

    return res.json({ enrollment });
  } catch (error) {
    console.error("getEnrollmentById error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

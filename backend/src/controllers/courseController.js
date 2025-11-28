// backend/src/controllers/courseController.js
const Course = require("../models/Course");

// GET /api/courses  -> list all approved courses
const getCourses = async (req, res) => {
  try {
    const { search, category, level } = req.query;

    const query = { isApproved: true };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    const courses = await Course.find(query)
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    return res.json({ courses });
  } catch (error) {
    console.error("getCourses error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name email"
    );

    if (!course || !course.isApproved) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.json({ course });
  } catch (error) {
    console.error("getCourseById error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/courses  -> create new course (instructor/admin only)
const createCourse = async (req, res) => {
  try {
    const { title, description, category, level, language, thumbnailUrl, price } =
      req.body || {};

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
      // isApproved: false  // if later you add admin approval
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

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
};

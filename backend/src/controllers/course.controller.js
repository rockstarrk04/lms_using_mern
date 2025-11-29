import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

export const getAllCourses = async (req, res) => {
  try {
    // Only return published courses to the public
    const courses = await Course.find({ isPublished: true }).populate('createdBy', 'name');
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate('createdBy', 'name avatar title')
      .populate({
        path: 'curriculum',
        populate: {
          path: 'lessons',
          select: 'title', // Only select lesson titles for the public view
        },
      });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getMyCreatedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, category, level } = req.body;
    const newCourse = await Course.create({
      title,
      description,
      category,
      level,
      createdBy: req.user.id,
    });
    res.status(201).json({ course: newCourse });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Check ownership
    if (course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized' });
    }

    // For now, we only handle text fields. Thumbnail upload would be handled here too.
    const updatedCourse = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    res.status(200).json({ course: updatedCourse });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getCourseForEnrolledUser = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ student: req.user.id, course: req.params.courseId });
    if (!enrollment) {
      return res.status(403).json({ message: 'You are not enrolled in this course.' });
    }

    const course = await Course.findById(req.params.courseId).populate({
      path: 'curriculum',
      populate: { path: 'lessons' },
    });

    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.status(200).json({ course, enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getRazorpayKey = (req, res) => res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
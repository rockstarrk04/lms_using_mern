import Course from "../models/Course.js";

export const findCourseById = async (id) => {
  return await Course.findById(id).populate("instructor", "name email");
};

export const updateCourseApprovalStatus = async (course, isApproved) => {
  course.isApproved = isApproved;
  await course.save();
  return course;
};

export const findAllCourses = async (page, limit) => {
  const skip = (page - 1) * limit;
  const courses = await Course.find({ isDeleted: { $ne: true } })
    .populate("instructor", "name email")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalCourses = await Course.countDocuments({ isDeleted: { $ne: true } });

  return {
    courses,
    currentPage: page,
    totalPages: Math.ceil(totalCourses / limit),
    totalCourses,
  };
};

export const createAdminCourse = async (courseData) => {
  const { title, description, instructor, category, level, language, thumbnailUrl, price } = courseData;
  const course = await Course.create({
    title,
    description,
    instructor,
    category,
    level,
    language,
    thumbnailUrl,
    price,
    isApproved: true, // Admin created courses are approved by default
  });
  return course;
};

export const softDeleteCourseById = async (id) => {
  const course = await Course.findById(id);
  if (!course) {
    return null;
  }
  course.isDeleted = true;
  await course.save();
  return course;
};

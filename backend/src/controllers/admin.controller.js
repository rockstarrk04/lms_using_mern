import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

// NOTE: These are placeholder functions. You will need to implement the logic for each.
export const getSiteStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    // Revenue calculation would be more complex in a real app
    const totalRevenue = 0;

    const stats = [
      { name: "Total Users", value: totalUsers },
      { name: "Total Courses", value: totalCourses },
      { name: "Total Enrollments", value: totalEnrollments },
      { name: "Total Revenue", value: `$${totalRevenue}` },
    ];
    res.status(200).json({ stats });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ users });
};
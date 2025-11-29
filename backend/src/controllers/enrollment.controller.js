import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id }).populate({
      path: 'course',
      select: 'title category thumbnail createdBy curriculum',
      populate: { path: 'curriculum', populate: { path: 'lessons' } },
    });

    const coursesWithProgress = enrollments.map(enrollment => {
      const course = enrollment.course.toObject();
      const totalLessons = course.curriculum.reduce((acc, mod) => acc + mod.lessons.length, 0);
      const completedCount = enrollment.completedLessons.length;
      course.progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
      return course;
    });

    res.status(200).json({ courses: coursesWithProgress });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const checkout = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const course = await Course.findById(req.body.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const options = {
      amount: course.price * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_order_${new Date().getTime()}`,
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occurred");

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is authentic, create enrollment
      await Enrollment.create({
        course: courseId,
        student: req.user.id,
      });

      res.status(200).json({ success: true, message: 'Enrollment successful.' });

    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const enrollFree = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.id;

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ course: courseId, student: studentId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'You are already enrolled in this course.' });
    }

    // Create new enrollment
    await Enrollment.create({
      course: courseId,
      student: studentId,
    });

    res.status(201).json({ success: true, message: 'Enrollment successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
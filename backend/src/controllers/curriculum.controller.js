import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';

export const addModuleToCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Module title is required.' });

    const course = await Course.findById(courseId);
    if (!course || course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized.' });
    }

    const newModule = await Module.create({ title, course: courseId });
    course.curriculum.push(newModule._id);
    await course.save();

    res.status(201).json({ success: true, module: newModule });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const addLessonToModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Lesson title is required.' });

    const module = await Module.findById(moduleId).populate('course');
    if (!module || module.course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized.' });
    }

    const newLesson = await Lesson.create({ title, module: moduleId });
    module.lessons.push(newLesson._id);
    await module.save();

    res.status(201).json({ success: true, lesson: newLesson });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId).populate({
      path: 'module',
      populate: { path: 'course' }
    });

    if (!lesson || lesson.module.course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized.' });
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, req.body, { new: true });
    res.status(200).json({ success: true, lesson: updatedLesson });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId).populate({
      path: 'module',
      populate: { path: 'course' }
    });

    if (!lesson || lesson.module.course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized.' });
    }

    await Module.findByIdAndUpdate(lesson.module._id, { $pull: { lessons: lessonId } });
    await Lesson.findByIdAndDelete(lessonId);

    res.status(200).json({ success: true, message: 'Lesson deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const deleteModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const module = await Module.findById(moduleId).populate('course');

    if (!module || module.course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized.' });
    }

    await Lesson.deleteMany({ module: moduleId });
    await Course.findByIdAndUpdate(module.course._id, { $pull: { curriculum: moduleId } });
    await Module.findByIdAndDelete(moduleId);

    res.status(200).json({ success: true, message: 'Module deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const updateCurriculumOrder = async (req, res) => {
  // This is a complex operation and is left as a placeholder for now.
  res.status(501).json({ message: 'Not Implemented' });
};
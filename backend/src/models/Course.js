import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Course title is required'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Course description is required'],
    },
    category: { type: String, trim: true },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'All Levels',
    },
    thumbnail: {
      type: String,
      default: 'https://placehold.co/300x170/1e293b/ffffff?text=LMS',
    },
    price: { type: Number, default: 0 },
    whatYouWillLearn: [{ type: String }],
    curriculum: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
    }],
    isPublished: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;

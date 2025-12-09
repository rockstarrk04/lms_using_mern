import React from "react";
import { Link } from "react-router-dom";
import { getThumbnailUrl } from "./getThumbnailUrl";

function CourseCard({ course }) {
  // Use the centralized utility function to get the thumbnail URL.
  const thumbnailUrl = getThumbnailUrl(course);

  return (
    <Link
      to={`/course/${course._id}`}
      className="group block overflow-hidden rounded-lg border border-slate-800 bg-slate-900 transition-all duration-300 ease-in-out hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10"
    >
      <img src={thumbnailUrl} alt={course.title} className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white">{course.title}</h3>
        <p className="mt-2 text-sm text-slate-400">{course.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-blue-400">$ 100</span>
          <span className="text-sm text-slate-400">By {course.instructor?.name || 'Instructor'}</span>
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;
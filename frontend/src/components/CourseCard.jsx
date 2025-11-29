import React from "react";
import { Link } from "react-router-dom";

function CourseCard({ course }) {
  // Destructure with default values to prevent errors if a prop is missing
  const {
    _id,
    thumbnail = "https://placehold.co/300x170/1e293b/ffffff?text=LMS", // Default placeholder
    category = "Uncategorized",
    title = "Untitled Course",
    description = "No description available.",
    createdBy,
  } = course;

  // Handle createdBy being either a string or a user object
  const instructorName = typeof createdBy === 'object' && createdBy !== null ? createdBy.name : createdBy;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10">
      {/* Card Image */}
      <div className="relative">
        <Link to={`/course/${_id}`} className="block">
          <img
            className="h-48 w-full object-cover"
            src={thumbnail}
            alt={`Thumbnail for ${title}`}
          />
        </Link>
        <span className="absolute top-3 right-3 inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
          {category}
        </span>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white">
            <Link
              to={`/course/${_id}`}
              className="transition-colors hover:text-blue-400"
            >
              {title}
            </Link>
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            By <span className="font-semibold text-slate-300">{instructorName || 'Unknown Instructor'}</span>
          </p>

          <p className="mt-3 text-sm text-slate-400 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Card Footer */}
        <div className="mt-5 pt-4 border-t border-slate-700">
          <Link
            to={`/course/${_id}`}
            className="flex w-full items-center justify-center rounded-lg bg-slate-700 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-600"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
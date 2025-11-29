import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import CourseCard from "./CourseCard"; // Reusing our existing component

function MyCourses() {
  const { token } = useContext(AuthContext);
  const { data: coursesData, isLoading, isError } = useApi("/enrollments/me", token);
  const courses = coursesData?.courses || [];

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
        <svg className="mr-3 h-10 w-10 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-2xl font-semibold text-white">Loading Your Courses...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          My Courses
        </h1>
        <p className="mt-2 text-lg text-slate-400">
          All the courses you are currently enrolled in.
        </p>
      </header>

      {isError && <p className="text-center text-red-400">{isError.info?.message || "Failed to fetch your courses. Please try again later."}</p>}

      {!isLoading && !isError && courses.length === 0 ? (
        <div className="text-center rounded-lg border-2 border-dashed border-slate-700 p-12">
          <h3 className="text-xl font-medium text-white">No Courses Yet</h3>
          <p className="mt-2 text-slate-400">You haven't enrolled in any courses. Let's change that!</p>
          <Link to="/courses" className="mt-6 inline-block rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCourses;
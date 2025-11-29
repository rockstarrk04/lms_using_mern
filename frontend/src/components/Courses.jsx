import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../api/client";
import CourseCard from "./CourseCard";
import { toast } from "react-hot-toast";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // This endpoint should return all *published* courses
        const response = await fetch(`${API_BASE_URL}/courses`);
        if (!response.ok) throw new Error("Failed to fetch courses.");

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response from server.");
        }

        const data = await response.json();
        setCourses(data.courses || []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
        <span className="text-2xl font-semibold text-white">Loading Courses...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Explore Our Courses
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          Find your next learning adventure from our curated collection of courses.
        </p>
        <div className="mt-8 mx-auto max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a course..."
            className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </header>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center rounded-lg border-2 border-dashed border-slate-700 p-12">
          <h3 className="text-xl font-medium text-white">No Courses Found</h3>
          <p className="mt-2 text-slate-400">
            We couldn't find any courses matching your search. Try a different term.
          </p>
        </div>
      )}
    </div>
  );
}

export default Courses;
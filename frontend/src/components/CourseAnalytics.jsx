import React, { useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";

const StatCard = ({ name, value, prefix = "" }) => (
  <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-6">
    <p className="text-sm font-medium text-slate-400">{name}</p>
    <p className="mt-2 text-3xl font-bold text-white">
      {prefix}
      {value}
    </p>
  </div>
);

function CourseAnalytics() {
  const { courseId } = useParams();
  const { token } = useContext(AuthContext);

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  const { data: analyticsData, isLoading, isError } = useApi(`/analytics/course/${courseId}`, token);
  const analytics = analyticsData?.analytics;

  if (isLoading) {
    return <div className="text-center py-20 text-white">Loading Analytics...</div>;
  }

  if (isError || !analytics) {
    const errorMessage = isError?.info?.message || "Could not load analytics data.";
    return <div className="text-center py-20 text-red-400">{errorMessage}</div>;
  }

  // Pagination logic
  const totalStudents = analytics.students.length;
  const totalPages = Math.ceil(totalStudents / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = analytics.students.slice(indexOfFirstStudent, indexOfLastStudent);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };


  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <img
          // Using Unsplash to get a relevant image based on the course title.
          src={analytics.thumbnail || `https://source.unsplash.com/200x200/?${encodeURIComponent(analytics.courseTitle)}`}
          alt={`${analytics.courseTitle} thumbnail`}
          className="h-32 w-32 rounded-lg object-cover"
        />
        <div>
          <p className="text-sm font-medium text-blue-400">Analytics</p>
          <h1 className="mt-1 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {analytics.courseTitle}
          </h1>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard name="Total Enrollments" value={analytics.totalEnrollments} />
        <StatCard name="Total Revenue" value={analytics.totalRevenue} prefix="$" />
        <StatCard name="Average Completion" value={`${analytics.averageCompletionRate}%`} />
      </div>

      {/* Enrolled Students Table */}
      <div className="mt-12">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h2 className="text-2xl font-semibold text-white">Enrolled Students</h2>
            <p className="mt-2 text-sm text-slate-400">
              A list of all the students enrolled in this course.
            </p>
          </div>
        </div>
        <div className="mt-6 -mx-4 ring-1 ring-slate-700 sm:-mx-6 sm:rounded-lg">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-800">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Name</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Email</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Enrolled On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/50">
              {currentStudents.map((student) => (
                <tr key={student._id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{student.name}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">{student.email}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">{new Date(student.enrolledAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-700 bg-slate-800/50 px-4 py-3 sm:px-6">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="rounded-md bg-slate-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="text-sm text-slate-300">
                Page <span className="font-medium text-white">{currentPage}</span> of <span className="font-medium text-white">{totalPages}</span>
              </div>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="rounded-md bg-slate-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseAnalytics;
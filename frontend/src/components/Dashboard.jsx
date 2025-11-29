import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";

// A small sub-component for stat cards
const StatCard = ({ name, value }) => (
  <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-6">
    <p className="text-sm font-medium text-slate-400">{name}</p>
    <p className="mt-2 text-3xl font-bold text-white">{value}</p>
  </div>
);

// A small sub-component for recent course list items
const RecentCourseItem = ({ course }) => (
  <li className="flex items-center justify-between rounded-lg bg-slate-800 p-4 transition-colors hover:bg-slate-700/50">
    <div>
      <p className="font-semibold text-white">{course.title}</p>
      <p className="text-sm text-slate-400">{course.category}</p>
    </div>
    <div className="flex items-center gap-4">
      <div className="w-24">
        <div className="h-2 rounded-full bg-slate-700">
          <div
            className="h-2 rounded-full bg-blue-500"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
        <p className="mt-1 text-right text-xs text-slate-400">{course.progress}%</p>
      </div>
      <Link
        to={`/learn/${course._id}`}
        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        Resume
      </Link>
    </div>
  </li>
);

function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const { data: enrolledCoursesData, isLoading } = useApi("/enrollments/me", token);
  const enrolledCourses = enrolledCoursesData?.courses || [];

  const recentCourses = enrolledCourses.slice(0, 3);
  const stats = [
    { name: "Courses Enrolled", value: enrolledCourses.length },
    { name: "Courses Completed", value: "0" }, // Placeholder
    { name: "Certificates Earned", value: "0" }, // Placeholder
  ];

  if (isLoading) {
    return <div className="text-center py-20 text-white">Loading Dashboard...</div>;
  }
  
  if (!user) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-2 text-lg text-slate-400">
          Let's continue learning and achieve your goals.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.name} name={stat.name} value={stat.value} />
        ))}
      </div>

      {/* Recent Courses Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-white">
          Continue Learning
        </h2>
        {recentCourses.length > 0 ? (
          <ul className="mt-6 space-y-4">
            {recentCourses.map((course) => (
              <RecentCourseItem key={course._id} course={course} />
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-slate-400">You are not enrolled in any courses yet.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
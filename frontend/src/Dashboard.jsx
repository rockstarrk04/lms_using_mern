// src/Dashboard.jsx
import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { API_BASE_URL } from "./api/client";

function Dashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useContext(AuthContext);

  const [myCourses, setMyCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Load instructor/admin courses
    const loadMyCourses = async () => {
      if (user.role !== "instructor" && user.role !== "admin") {
        setLoadingCourses(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/courses/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setMyCourses(data.courses || []);
      } catch (err) {
        console.error("Error loading my courses", err);
      } finally {
        setLoadingCourses(false);
      }
    };

    // Load student enrollments
    const loadMyEnrollments = async () => {
      if (user.role !== "student") {
        setLoadingEnrollments(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/enrollments/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setEnrollments(data.enrollments || []);
      } catch (err) {
        console.error("Error loading enrollments", err);
      } finally {
        setLoadingEnrollments(false);
      }
    };

    loadMyCourses();
    loadMyEnrollments();
  }, [user, token, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-5xl mx-auto py-8 px-4">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
            <p className="text-sm text-slate-300">
              Welcome, <span className="font-semibold">{user.name}</span> ({user.role})
            </p>
          </div>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-medium"
          >
            Logout
          </button>
        </div>

        {/* STUDENT PANEL */}
        {user.role === "student" && (
          <div className="bg-slate-800 rounded-xl p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">My Enrolled Courses</h2>

            {loadingEnrollments ? (
              <p className="text-sm text-slate-300">Loading your courses...</p>
            ) : enrollments.length === 0 ? (
              <p className="text-sm text-slate-400">
                You are not enrolled in any courses yet.{" "}
                <Link to="/courses" className="text-blue-400 hover:underline">
                  Browse courses
                </Link>
              </p>
            ) : (
              <div className="space-y-2">
                {enrollments.map((enrollment) => (
                  <div
                    key={enrollment._id}
                    className="bg-slate-900 rounded-lg p-3 text-sm"
                  >
                    <p className="font-semibold">
                      {enrollment.course?.title || "Untitled course"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {enrollment.course?.category || "Uncategorized"} •{" "}
                      {enrollment.course?.level}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* INSTRUCTOR OR ADMIN PANEL */}
        {(user.role === "instructor" || user.role === "admin") && (
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">My Created Courses</h2>
              <p className="text-xs text-slate-400">
                Course management UI coming soon.
              </p>
            </div>

            {loadingCourses ? (
              <p className="text-sm text-slate-300">Loading your courses...</p>
            ) : myCourses.length === 0 ? (
              <p className="text-sm text-slate-400">
                You haven't created any courses yet.
              </p>
            ) : (
              <div className="space-y-2">
                {myCourses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-slate-900 rounded-lg p-3 text-sm"
                  >
                    <p className="font-semibold">{course.title}</p>
                    <p className="text-xs text-slate-400">
                      {course.category || "Uncategorized"} • {course.level}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;

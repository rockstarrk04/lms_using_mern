// src/CourseDetails.jsx
import { useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { useApi } from "./hooks/useApi";
import { API_BASE_URL } from "./api/client";

function CourseDetails() {
  const { id } = useParams(); // course id from route
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const { data: courseData, isLoading: courseLoading, isError: courseError } = useApi(`/courses/${id}`);
  const { data: lessonsData, isLoading: lessonsLoading, isError: lessonsError } = useApi(`/courses/${id}/lessons`, token);
  const { data: enrollmentData, isLoading: enrollmentLoading, isError: enrollmentError, mutate: mutateEnrollment } = useApi(`/enrollments/check/${id}`, token, {
    shouldRetryOnError: false,
  });

  const course = courseData?.course;
  const lessons = lessonsData?.lessons || [];
  const isEnrolled = enrollmentData?.isEnrolled;

  const loading = courseLoading || lessonsLoading || enrollmentLoading;
  const error = courseError || lessonsError || enrollmentError;


  const handleEnroll = async () => {
    if (!user) return navigate("/login");

    if (user.role !== "student") {
      alert("Only students can enroll in this course.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/enrollments/${id}/enroll`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Enrollment failed");
      } else {
        alert("Enrolled successfully!");
        mutateEnrollment();
      }
    } catch (err) {
      alert("Enrollment error: " + err.message);
    }
  };

  // ---------------- RENDERING ----------------

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p>Loading course...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <p className="mb-3">{error || "Course not found"}</p>
        <Link to="/courses" className="text-sm text-blue-400 hover:underline">
          Back to courses
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-slate-400 hover:text-white mb-3"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
          <p className="text-sm text-slate-300 mb-2">{course.description}</p>

          <p className="text-xs text-slate-400 mb-1">
            Category: {course.category || "General"} • Level: {course.level}
          </p>

          {course.instructor && (
            <p className="text-xs text-slate-400">
              Instructor: {course.instructor.name}
            </p>
          )}

          {/* ENROLLMENT BUTTONS */}
          <div className="mt-4 flex gap-3">
            {user && user.role === "student" && !isEnrolled && (
              <button
                onClick={handleEnroll}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium"
              >
                Enroll in course
              </button>
            )}

            {user && user.role === "student" && isEnrolled && (
              <span className="px-4 py-2 rounded-lg bg-emerald-600 text-xs font-medium">
                Enrolled
              </span>
            )}

            {/* Instructor edit / manage button */}
            {user &&
              user.role === "instructor" &&
              user._id === course.instructor?._id && (
                <button
                  onClick={() =>
                    navigate(`/instructor/courses/${course._id}`)
                  }
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-medium"
                >
                  Manage Course
                </button>
              )}
          </div>
        </div>

        {/* Lessons */}
        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3">Lessons</h2>

          {lessons.length === 0 ? (
            <p className="text-sm text-slate-400">No lessons added yet.</p>
          ) : (
            <ul className="space-y-2">
              {lessons.map((lesson) => (
                <li
                  key={lesson._id}
                  className="bg-slate-900 rounded-lg p-3 text-sm"
                >
                  <p className="font-semibold mb-1">
                    {lesson.order ? `${lesson.order}. ` : ""}
                    {lesson.title}
                  </p>

                  {lesson.description && (
                    <p className="text-xs text-slate-400 mb-1">
                      {lesson.description}
                    </p>
                  )}

                  {isEnrolled && (
                    <Link
                      to={`/courses/${course._id}/lessons/${lesson._id}`}
                      className="text-xs text-blue-400 hover:underline mt-1 block"
                    >
                      Start Lesson
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;

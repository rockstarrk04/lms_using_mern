import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../api/client";
import { toast } from "react-hot-toast";

// --- SVG Icons ---
const PlayCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
  </svg>
);

const CheckCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);

const MenuIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const CloseIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
// --- End SVG Icons ---

function CoursePlayer() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState(new Set());

  useEffect(() => {
    const fetchCourseContent = async () => {
      if (!token) return;
      try {
        setLoading(true);
        // This protected endpoint should verify enrollment before returning course content
        const response = await fetch(`${API_BASE_URL}/courses/learn/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 403) {
          toast.error("You are not enrolled in this course.");
          navigate("/my-courses");
          return;
        }
        if (!response.ok) {
          throw new Error("Failed to load course content.");
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response from server.");
        }

        const data = await response.json();
        setCourse(data.course);
        // The backend now returns enrollment details including completed lessons
        setCompletedLessons(new Set(data.enrollment?.completedLessons || []));

        // Set the first lesson of the first module as the active one
        if (data.course?.curriculum?.[0]?.lessons?.[0]) {
          setActiveLesson(data.course.curriculum[0].lessons[0]);
        }
      } catch (err) {
        toast.error(err.message);
        navigate("/my-courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContent();
  }, [courseId, token, navigate]);

  const findNextLesson = () => {
    if (!course || !activeLesson) return null;

    let foundCurrent = false;
    for (const module of course.curriculum) {
      for (const lesson of module.lessons) {
        if (foundCurrent) {
          return lesson; // This is the next lesson
        }
        if (lesson._id === activeLesson._id) {
          foundCurrent = true;
        }
      }
    }
    return null; // No next lesson found
  };

  const handleMarkAsComplete = async () => {
    if (!activeLesson) return;

    try {
      // This new endpoint will handle marking a lesson as complete
      const response = await fetch(`${API_BASE_URL}/enrollments/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId, lessonId: activeLesson._id }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update progress.' }));
        throw new Error(errorData.message);
      }

      // Update local state for immediate feedback
      setCompletedLessons(prev => new Set(prev).add(activeLesson._id));
      toast.success(`Lesson "${activeLesson.title}" marked as complete!`);

      // Auto-advance to the next lesson
      const nextLesson = findNextLesson();
      if (nextLesson) {
        setActiveLesson(nextLesson);
        toast("Moving to the next lesson.", { icon: "🚀" });
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
        <span className="text-2xl font-semibold text-white">Loading Course Player...</span>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="lg:flex h-[calc(100vh-4rem)] bg-slate-900 text-white">
      {/* Sidebar */}
      <aside className={`w-full lg:w-80 lg:flex-shrink-0 lg:overflow-y-auto lg:border-r border-slate-800 bg-slate-900 absolute lg:relative z-20 lg:z-0 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5">
          <Link to="/my-courses" className="text-sm text-slate-400 hover:text-white">&larr; Back to My Courses</Link>
          <h2 className="mt-3 text-xl font-bold">{course.title}</h2>
        </div>
        <nav>
          {course.curriculum.map((module, moduleIndex) => (
            <div key={module._id || moduleIndex} className="border-t border-slate-800">
              <h3 className="p-5 font-semibold">{module.title}</h3>
              <ul>
                {module.lessons.map((lesson) => (
                  <li key={lesson._id}>
                    <button
                      onClick={() => {
                        setActiveLesson(lesson);
                        setIsSidebarOpen(false); // Close sidebar on lesson selection
                      }}
                      className={`flex w-full items-start gap-3 px-5 py-3 text-left text-sm transition-colors ${
                        activeLesson?._id === lesson._id
                          ? "bg-blue-600/20 text-blue-300"
                          : "text-slate-400 hover:bg-slate-800/50"
                      }`}
                    >
                      {completedLessons.has(lesson._id) ? (
                        <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                      ) : (
                        <PlayCircleIcon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${
                          activeLesson?._id === lesson._id ? 'text-blue-400' : ''
                        }`} />
                      )}
                      <span>{lesson.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed top-20 left-4 z-30 inline-flex items-center justify-center rounded-md bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
        >
          <span className="sr-only">Open sidebar</span>
          {isSidebarOpen ? (
            <CloseIcon className="block h-6 w-6" />
          ) : (
            <MenuIcon className="block h-6 w-6" />
          )}
        </button>
        {activeLesson ? (
          <div>
            {/* Video Player Area */}
            <div className="aspect-video bg-black">
              {activeLesson.videoUrl ? (
                <iframe
                  className="h-full w-full"
                  src={activeLesson.videoUrl} // e.g., "https://www.youtube.com/embed/..."
                  title={activeLesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-800">
                  <p>Video not available for this lesson.</p>
                </div>
              )}
            </div>

            {/* Lesson Details */}
            <div className="p-8">
              <h1 className="text-3xl font-bold tracking-tight">{activeLesson.title}</h1>
              <p className="mt-4 text-slate-300">{activeLesson.description || "No description for this lesson."}</p>
              <div className="mt-8 flex justify-end">
                {completedLessons.has(activeLesson._id) ? (
                  <div className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 font-semibold text-emerald-400">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span>Completed</span>
                  </div>
                ) : (
                  <button
                    onClick={handleMarkAsComplete}
                    className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    Mark as Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-lg text-slate-400">Select a lesson to begin.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default CoursePlayer;
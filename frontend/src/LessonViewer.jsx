// src/LessonViewer.jsx
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "./api/client";
import { AuthContext } from "./context/AuthContext";

function LessonViewer() {
  const { courseId, lessonId } = useParams();
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLesson = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to load lesson");
        } else {
          setLesson(data.lesson);
        }
      } catch (err) {
        setError("Something went wrong while loading the lesson.");
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [lessonId, token, user, navigate]);

  // ---------- UI STATES ----------

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>Loading lesson...</p>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
        <p className="mb-3">{error || "Lesson not found"}</p>
        <Link
          to={`/courses/${courseId}`}
          className="text-sm text-blue-400 hover:underline"
        >
          Back to course
        </Link>
      </div>
    );
  }

  // ---------- MAIN UI ----------

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(`/courses/${courseId}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-4">

        <button
          onClick={handleBack}
          className="text-xs text-slate-400 hover:text-white"
        >
          ← Back
        </button>

        <div>
          <p className="text-xs text-slate-400 mb-1">
            Course: {lesson.course?.title || "Untitled Course"}
          </p>
          <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>

          {lesson.description && (
            <p className="text-sm text-slate-300 mb-3">{lesson.description}</p>
          )}
        </div>

        {/* Video section */}
        {lesson.videoUrl ? (
          <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
            <iframe
              src={lesson.videoUrl}
              title="Lesson video"
              className="w-full h-full border-0"
              allowFullScreen
            />
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic">
            No video available for this lesson.
          </p>
        )}

        {/* Text content */}
        {lesson.content && (
          <div className="bg-slate-800 rounded-xl p-4 text-sm text-slate-100 whitespace-pre-wrap">
            {lesson.content}
          </div>
        )}
      </div>
    </div>
  );
}

export default LessonViewer;

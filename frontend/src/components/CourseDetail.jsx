import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../api/client";
import { AuthContext } from "../context/AuthContext";
import { getThumbnailUrl } from "./getThumbnailUrl";

// --- SVG Icons ---
const CheckCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChevronDownIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);
// --- End SVG Icons ---


const CurriculumAccordion = ({ module, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0); // Open the first module by default

  return (
    <div className="border-b border-slate-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left text-lg font-semibold text-white"
      >
        <span>{module.title}</span>
        <ChevronDownIcon className={`h-6 w-6 transform text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <ul className="pb-5 pl-4">
          {module.lessons.map((lesson, i) => (
            <li key={i} className="mt-2 flex items-center text-slate-300">
              <span className="mr-3 h-2 w-2 rounded-full bg-slate-500"></span>
              {lesson.title || lesson}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
        if (!response.ok) {
          throw new Error("Course not found or server error.");
        }
        // Check if the response has content before parsing as JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
        setCourse(data.course);
        } else {
          throw new Error("Received non-JSON response from server.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleEnrollment = async () => {
    if (!token) {
      toast.error("You must be logged in to enroll.");
      return;
    }
    setIsEnrolling(true);
  
    try {
      // This new endpoint handles enrollment directly, bypassing payment for now.
      const response = await fetch(`${API_BASE_URL}/enrollments/enroll-free`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId: course._id }),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Enrollment failed." }));
        throw new Error(errorData.message);
      }
  
      toast.success("Enrollment Successful!");
      // You can add navigation here, e.g., to the "My Courses" page
      // navigate('/my-courses');
    } catch (err) {
      toast.error(err.message || "Enrollment failed. Please try again later.");
      console.error(err);
    } finally {
      setIsEnrolling(false);
    }
  };
  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
        <svg className="mr-3 h-10 w-10 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-2xl font-semibold text-white">Loading Course...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-bold text-red-500">An Error Occurred</h2>
        <p className="mt-2 text-lg text-slate-300">{error}</p>
        <Link to="/" className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white hover:bg-blue-700">
          Go to Homepage
        </Link>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-bold text-white">Course Not Found</h2>
        <p className="mt-2 text-lg text-slate-300">We couldn't find the course you're looking for.</p>
        <Link to="/" className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white hover:bg-blue-700">
          Go to Homepage
        </Link>
      </div>
    );
  }

  const thumbnailUrl = getThumbnailUrl(course, '500x281');

  // Mock data for "What you'll learn" section based on course title
  const getLearningPoints = (courseTitle) => {
    const lowerCaseTitle = courseTitle.toLowerCase();
    const points = {
      "python": [
        "Master Python fundamentals from scratch.",
        "Build real-world applications and scripts.",
        "Understand object-oriented programming concepts.",
        "Work with data structures like lists and dictionaries.",
        "Automate tasks with Python.",
        "Learn to use popular Python libraries."
      ],
      "web development bootcamp": [
        "Build responsive websites with HTML5 and CSS3.",
        "Master JavaScript, from basics to advanced concepts.",
        "Learn modern frontend frameworks like React.",
        "Develop backend services with Node.js and Express.",
        "Work with databases like MongoDB.",
        "Deploy full-stack web applications."
      ],
      "data science fundamentals": [
        "Understand the core concepts of data science.",
        "Perform data analysis and visualization with Python.",
        "Use libraries like Pandas, NumPy, and Matplotlib.",
        "Learn the basics of machine learning.",
        "Clean and preprocess complex datasets.",
        "Communicate findings through data storytelling."
      ],
      "sql & database management": [
        "Write complex SQL queries to retrieve data.",
        "Design and manage relational databases.",
        "Understand database normalization and JOINs.",
        "Perform data manipulation (INSERT, UPDATE, DELETE).",
        "Learn about indexes and performance optimization."
      ],
      "ai & machine learning basics": [
        "Grasp the fundamental concepts of AI and ML.",
        "Understand different types of machine learning algorithms.",
        "Build your first machine learning models with Scikit-learn.",
        "Learn about neural networks and deep learning.",
        "Evaluate the performance of your models."
      ]
    };

    const key = Object.keys(points).find(k => lowerCaseTitle.includes(k));
    return key ? points[key] : (course.whatYouWillLearn || []);
  };

  const whatYouWillLearn = getLearningPoints(course.title);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Left Column: Course Info */}
        <div className="lg:col-span-2">
          <span className="mb-2 inline-block rounded-full bg-blue-600/20 px-3 py-1 text-sm font-semibold text-blue-400">
            {course.category}
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {course.title}
          </h1>
          <p className="mt-4 text-lg text-slate-300">{course.description}</p>

          <div className="mt-8 flex items-center gap-4">
            {course.instructor?.avatar ? (
              <img className="h-12 w-12 rounded-full object-cover" src={course.instructor.avatar} alt={course.instructor.name} />
            ) : (
              <div className="h-12 w-12 rounded-full bg-slate-700"></div>
            )}
            <div> 
              <p className="font-semibold text-white">{course.instructor?.name || 'Unknown Instructor'}</p>
              <p className="text-sm text-slate-400">{course.instructor?.title || 'Instructor'}</p>
            </div>
          </div>

          {/* What you'll learn */}
          <div className="mt-12 rounded-xl border border-slate-700/50 bg-slate-800/60 p-8">
            <h2 className="text-2xl font-bold text-white">What you'll learn</h2>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {whatYouWillLearn.map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircleIcon className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-blue-500" />
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Curriculum */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white">Course Curriculum</h2>
            <div className="mt-6">
              {course.curriculum.map((module, index) => (
                <CurriculumAccordion key={index} module={module} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800">
              <img
                className="h-56 w-full object-cover"
                src={thumbnailUrl}
                alt={`Thumbnail for ${course.title}`}
              />
              <div className="p-6">
                <p className="text-3xl font-bold text-white">
                  $ 100
                </p>
                <button
                  onClick={handleEnrollment}
                  disabled={isEnrolling}
                  className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition-all duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isEnrolling ? "Processing..." : "Enroll Now"}
                </button>
                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-slate-400" />
                    <span>Lifetime access</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-slate-400" />
                    <span>Certificate of completion</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-slate-400" />
                    <span>Access on mobile and TV</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
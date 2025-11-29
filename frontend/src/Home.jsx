// src/Home.jsx
import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="max-w-xl mx-auto p-6 text-center">

        <h1 className="text-3xl font-bold mb-4">
          LMS – MERN Stack
        </h1>

        <p className="text-sm text-slate-300 mb-6">
          A simple learning management system built with MERN. Login or register
          to get started — browse courses, create courses (instructor), or enroll
          as a student.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
          >
            Register
          </Link>

          <Link
            to="/courses"
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm"
          >
            Browse Courses
          </Link>
        </div>

      </div>
    </main>
  );
}

export default Home;

// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import CoursesList from "./CoursesList";
import CourseDetails from "./CourseDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./AdminDashboard";
import LessonViewer from "./LessonViewer";
import Navbar from "./components/Navbar";

function App() {
  const location = useLocation();

  /**
   * Hide navbar ONLY on lesson viewer page
   * Example: /courses/123/lessons/456
   */
  const hideNavbar =
    location.pathname.startsWith("/courses/") &&
    location.pathname.includes("/lessons/");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/courses" element={<CoursesList />} />
        <Route path="/courses/:id" element={<CourseDetails />} />

        {/* Student Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Panel */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Lessons Viewer */}
        <Route
          path="/courses/:courseId/lessons/:lessonId"
          element={
            <ProtectedRoute>
              <LessonViewer />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;

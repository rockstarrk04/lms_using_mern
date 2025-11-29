import { Route, Routes } from "react-router-dom";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

// Component Imports
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/Dashboard";
import CourseDetail from "./components/CourseDetail";
import MyCourses from "./components/MyCourses";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import InstructorRoute from "./components/InstructorRoute";
import AdminDashboard from "./components/AdminDashboard";
import InstructorDashboard from "./components/InstructorDashboard";
import CoursePlayer from "./components/CoursePlayer";
import CreateCourse from "./components/CreateCourse";
import ManageCourse from "./components/ManageCourse";
import CourseAnalytics from "./components/CourseAnalytics";
import Courses from "./components/Courses";
import Homepage from "./components/Homepage";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";
import About from "./components/About";
import Contact from "./components/Contact";
import Terms from "./components/Terms";
import Privacy from "./components/Privacy";
import SessionTimeoutModal from "./components/SessionTimeoutModal";
import { toast } from "react-hot-toast";
import { AuthContext } from "./context/AuthContext";
import { useIdleTimeout } from "./components/useIdleTimeout";

function App() {
  const { loading, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleIdle = () => {
    if (isAuthenticated) {
      logout();
      toast.error("You have been logged out due to inactivity.");
      navigate("/login");
    }
  };

  const { showWarning, stayActive } = useIdleTimeout(handleIdle);



  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900">
        <svg className="mr-3 h-10 w-10 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-2xl font-semibold text-white">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {isAuthenticated && showWarning && (
        <SessionTimeoutModal
          onStay={stayActive}
          onLogout={handleIdle}
        />
      )}
      <main className="min-h-[calc(100vh-12rem)]"> {/* Ensure main content pushes footer down */}
        <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* --- Protected Routes --- */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/my-courses"
          element={<ProtectedRoute><MyCourses /></ProtectedRoute>}
        />
        <Route
          path="/learn/:courseId"
          element={<ProtectedRoute><CoursePlayer /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><Profile /></ProtectedRoute>}
        />
        {/* --- Instructor Routes --- */}
        <Route
          path="/instructor/dashboard"
          element={<InstructorRoute><InstructorDashboard /></InstructorRoute>}
        />
        <Route
          path="/instructor/courses/create"
          element={<InstructorRoute><CreateCourse /></InstructorRoute>}
        />
        <Route
          path="/instructor/courses/edit/:courseId"
          element={<InstructorRoute><ManageCourse /></InstructorRoute>}
        />
        <Route
          path="/instructor/courses/analytics/:courseId"
          element={<InstructorRoute><CourseAnalytics /></InstructorRoute>}
        />
        {/* --- Admin Routes --- */}
        <Route
          path="/admin/dashboard"
          element={<AdminRoute><AdminDashboard /></AdminRoute>}
        />
        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
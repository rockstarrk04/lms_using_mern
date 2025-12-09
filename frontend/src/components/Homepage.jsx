import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../api/client";
import CourseCard from "./CourseCard";

// --- SVG Icons for Features Section ---
// (SVG Icon components remain the same)
const BookOpenIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);
const VideoCameraIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9a2.25 2.25 0 00-2.25 2.25v9A2.25 2.25 0 004.5 18.75z" />
  </svg>
);
const AcademicCapIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path d="M12 14.25c-2.43 0-4.63.62-6.5 1.75.24-.98.5-1.9.81-2.75A13.43 13.43 0 0112 12.25c1.96 0 3.83.44 5.48 1.22.3.86.56 1.77.8 2.75-1.87-1.13-4.07-1.75-6.28-1.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25c-2.43 0-4.63.62-6.5 1.75.24-.98.5-1.9.81-2.75A13.43 13.43 0 0112 12.25c1.96 0 3.83.44 5.48 1.22.3.86.56 1.77.8 2.75-1.87-1.13-4.07-1.75-6.28-1.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 12.75a9.75 9.75 0 11-19.5 0 9.75 9.75 0 0119.5 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.25c-2.49 0-4.72.6-6.5 1.65" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.25c2.49 0 4.72.6 6.5 1.65" />
  </svg>
);

function Homepage() {
  const [featuredCourses, setFeaturedCourses] = useState([]);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        // Fetch all published courses and take the first 3 as "featured"
        const response = await fetch(`${API_BASE_URL}/courses`);
        if (!response.ok) throw new Error("Failed to fetch courses.");
        const data = await response.json();
        setFeaturedCourses((data.courses || []).slice(0, 3));
      } catch (err) {
        console.error("Error fetching featured courses:", err);
      }
    };
    fetchFeaturedCourses();
  }, []);

  return (
    <div className="text-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-slate-900 pt-14">
        {/* Decorative gradient */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#0ea5e9] to-[#3b82f6] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Unlock Your Potential, One Course at a Time.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              Welcome to our Learning Management System. Discover a world of knowledge with our expert-led courses designed to help you grow personally and professionally.
            </p>
            <div className="mt-10 flex items-center gap-x-6 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
              <Link to="/courses" className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                Explore Courses
              </Link>
              <Link to="/register" className="text-sm font-semibold leading-6 text-white transition-transform hover:translate-x-1">
                Get Started <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Courses Section */}
      {featuredCourses.length > 0 && (
        <div className="bg-slate-900/50">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-400">Start Your Journey</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Featured Courses</p>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                Explore our most popular courses and find the perfect one to kickstart your learning adventure.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {featuredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-base font-semibold leading-7 text-blue-400">Learn Faster</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Everything you need to succeed</p>
            <p className="mt-6 text-lg leading-8 text-slate-300">Our platform provides a comprehensive set of tools and resources to enhance your learning journey, from interactive lessons to expert-led instruction.</p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16 animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <BookOpenIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Expert-Led Courses
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-400">Learn from industry professionals who bring real-world experience and insights to every lesson.</dd>
              </div>
              <div className="relative pl-16 animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <VideoCameraIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Interactive Video Lessons
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-400">Engage with high-quality video content that makes complex topics easy to understand and follow.</dd>
              </div>
              <div className="relative pl-16 animate-fadeInUp" style={{ animationDelay: '0.9s' }}>
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <AcademicCapIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Track Your Progress
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-400">Stay motivated by tracking your course completion and celebrating your learning milestones.</dd>
              </div>
              {/* You can add more features here with increasing animation delays */}
            </dl>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-slate-900 pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 ">
          <div className="relative isolate overflow-hidden bg-slate-800 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to dive in?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Join thousands of learners and start mastering new skills today. Create your account and begin your journey.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/register" className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Get Started</Link>
            </div>
            <div className="absolute -top-24 left-1/2 -z-10 h-[50rem] w-[50rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]" aria-hidden="true">
              <svg viewBox="0 0 1024 1024" className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 h-[64rem] w-[64rem] [mask-image:radial-gradient(closest-side,white,transparent)]"><ellipse cx="512" cy="512" fill="url(#8d958450-c69f-4251-94bc-4e091a323369)" rx="512" ry="512" /><defs><radialGradient id="8d958450-c69f-4251-94bc-4e091a323369"><stop stopColor="#3b82f6" /><stop offset="1" stopColor="#0ea5e9" /></radialGradient></defs></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
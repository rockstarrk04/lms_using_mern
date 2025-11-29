import React from "react";
import { Link } from "react-router-dom";

// --- SVG Icons for Features Section ---
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
  return (
    <div className="text-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-slate-900">
        {/* Decorative gradient */}
        <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#0ea5e9] to-[#3b82f6] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
        </div>
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Unlock Your Potential, One Course at a Time.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              Welcome to our Learning Management System. Discover a world of knowledge with our expert-led courses designed to help you grow personally and professionally.
            </p>
            <div className="mt-10 flex items-center gap-x-6 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
              <Link
                to="/courses"
                className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Explore Courses
              </Link>
              <Link to="/register" className="text-sm font-semibold leading-6 text-white transition-transform hover:translate-x-1">
                Get Started <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div className="-m-2 rounded-xl bg-slate-800/5 p-2 ring-1 ring-inset ring-slate-700/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <img
                  src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=2574&auto=format&fit=crop"
                  alt="Person learning on a laptop in a modern workspace"
                  width={2432}
                  height={1442}
                  className="w-[76rem] rounded-md shadow-2xl ring-1 ring-slate-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-slate-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
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

      {/* Logo Cloud Section */}
      <div className="bg-slate-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-center text-lg font-semibold leading-8 text-white">
            Trusted by the world’s most innovative teams
          </h2>
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
            <img className="col-span-2 max-h-12 w-full object-contain lg:col-span-1" src="https://tailwindui.com/img/logos/158x48/transistor-logo-white.svg" alt="Transistor" width={158} height={48} />
            <img className="col-span-2 max-h-12 w-full object-contain lg:col-span-1" src="https://tailwindui.com/img/logos/158x48/reform-logo-white.svg" alt="Reform" width={158} height={48} />
            <img className="col-span-2 max-h-12 w-full object-contain lg:col-span-1" src="https://tailwindui.com/img/logos/158x48/tuple-logo-white.svg" alt="Tuple" width={158} height={48} />
            <img className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1" src="https://tailwindui.com/img/logos/158x48/savvycal-logo-white.svg" alt="SavvyCal" width={158} height={48} />
            <img className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1" src="https://tailwindui.com/img/logos/158x48/statamic-logo-white.svg" alt="Statamic" width={158} height={48} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../api/client";
import { toast } from "react-hot-toast";

function InstructorDashboard() {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!token) return;
      try {
        setLoading(true);
        // This endpoint should return courses created by the logged-in instructor
        const response = await fetch(`${API_BASE_URL}/courses/my-creations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch your courses.");

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response from server.");
        }

        const data = await response.json();
        setMyCourses(data.courses || []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, [token]);

  if (loading) {
    return <div className="text-center py-20 text-white">Loading Instructor Dashboard...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Instructor Dashboard
          </h1>
          <p className="mt-2 text-lg text-slate-400">
            Manage your courses and content.
          </p>
        </div>
        <Link
          to="/instructor/courses/create"
          className="rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition-all duration-300 ease-in-out hover:bg-blue-700"
        >
          + Create New Course
        </Link>
      </header>

      {/* Courses List */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-white">My Created Courses</h2>
        {myCourses.length > 0 ? (
          <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow ring-1 ring-slate-700 sm:rounded-lg">
                <table className="min-w-full divide-y divide-slate-700">
                  <thead className="bg-slate-800">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Title</th>
                      <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-white lg:table-cell">Category</th>
                      <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-white sm:table-cell">Status</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Analytics</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Edit</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                    {myCourses.map((course) => (
                      <tr key={course._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{course.title}</td>
                        <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-slate-300 lg:table-cell">{course.category}</td>
                        <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-slate-300 sm:table-cell">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${course.isPublished ? 'bg-green-500/10 text-green-400 ring-1 ring-inset ring-green-500/20' : 'bg-yellow-500/10 text-yellow-400 ring-1 ring-inset ring-yellow-500/20'}`}>
                            {course.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">
                          <Link to={`/instructor/courses/analytics/${course._id}`} className="text-blue-400 hover:text-blue-300">View</Link>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link to={`/instructor/courses/edit/${course._id}`} className="text-blue-400 hover:text-blue-300">Manage</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-slate-400">You have not created any courses yet.</p>
        )}
      </div>
    </div>
  );
}

export default InstructorDashboard;
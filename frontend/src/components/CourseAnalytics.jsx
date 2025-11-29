import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../api/client";
import { toast } from "react-hot-toast";

const StatCard = ({ name, value, prefix = "" }) => (
  <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-6">
    <p className="text-sm font-medium text-slate-400">{name}</p>
    <p className="mt-2 text-3xl font-bold text-white">
      {prefix}
      {value}
    </p>
  </div>
);

function CourseAnalytics() {
  const { courseId } = useParams();
  const { token } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/analytics/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch analytics data.");

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response from server.");
        }

        const data = await response.json();
        setAnalytics(data.analytics);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [courseId, token]);

  if (loading) {
    return <div className="text-center py-20 text-white">Loading Analytics...</div>;
  }

  if (!analytics) {
    return <div className="text-center py-20 text-white">Could not load analytics data.</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10">
        <p className="text-sm font-medium text-blue-400">Analytics</p>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {analytics.courseTitle}
        </h1>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard name="Total Enrollments" value={analytics.totalEnrollments} />
        <StatCard name="Total Revenue" value={analytics.totalRevenue} prefix="$" />
        <StatCard name="Average Completion" value={`${analytics.averageCompletionRate}%`} />
      </div>

      {/* Enrolled Students Table */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-white">Enrolled Students</h2>
        <div className="mt-6 flow-root">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow ring-1 ring-slate-700 sm:rounded-lg">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-800">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Email</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Enrolled On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                  {analytics.students.map((student) => (
                    <tr key={student._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{student.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">{student.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">{new Date(student.enrolledAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseAnalytics;
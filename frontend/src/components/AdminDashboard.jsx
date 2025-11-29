import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../api/client";

// Reusable StatCard from the main dashboard
const StatCard = ({ name, value }) => (
  <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-6">
    <p className="text-sm font-medium text-slate-400">{name}</p>
    <p className="mt-2 text-3xl font-bold text-white">{value}</p>
  </div>
);

function AdminDashboard() {
  const { user, token } = useContext(AuthContext);
  const [stats, setStats] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        // Fetch site-wide stats
        const statsPromise = fetch(`${API_BASE_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Fetch all users
        const usersPromise = fetch(`${API_BASE_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const [statsRes, usersRes] = await Promise.all([statsPromise, usersPromise]);

        if (!statsRes.ok || !usersRes.ok) {
          throw new Error("Failed to fetch admin data.");
        }

        const statsContentType = statsRes.headers.get("content-type");
        const usersContentType = usersRes.headers.get("content-type");

        if (!statsContentType || !statsContentType.includes("application/json") || !usersContentType || !usersContentType.includes("application/json")) {
          throw new Error("Received non-JSON response from server.");
        }

        const [statsData, usersData] = await Promise.all([
          statsRes.json(),
          usersRes.json()
        ]);

        setStats(statsData.stats || []);
        setUsers(usersData.users || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [token]);

  if (loading) {
    return <div className="text-center py-20 text-white">Loading Admin Dashboard...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-lg text-slate-400">
          Site-wide management and statistics.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.name} name={stat.name} value={stat.value} />
        ))}
      </div>

      {/* Recent Users Table */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-white">Recent Users</h2>
        <div className="mt-6 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-slate-700 sm:rounded-lg">
                <table className="min-w-full divide-y divide-slate-700">
                  <thead className="bg-slate-800">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Name</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Email</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                    {users.map((person) => (
                      <tr key={person.email}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{person.name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">{person.email}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300 capitalize">{person.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
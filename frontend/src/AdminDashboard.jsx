import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import { API_BASE_URL } from "./api/client";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [usersData, setUsersData] = useState({ data: [], page: 1, pages: 1 });
  const [coursesData, setCoursesData] = useState({ data: [], page: 1, pages: 1 });

  const [usersPage, setUsersPage] = useState(1);
  const [coursesPage, setCoursesPage] = useState(1);

  const [users, setUsers] = useState([]); // Kept for instructor dropdown

  const [loading, setLoading] = useState(true);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);

  // ================================
  // FETCH DATA
  // ================================
  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        fetch(`${API_BASE_URL}/admin/users?page=${usersPage}&limit=5`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/admin/courses?page=${coursesPage}&limit=5`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [usersResult, coursesResult] = results;

      if (usersResult.status === "fulfilled" && usersResult.value.ok) {
        const data = await usersResult.value.json();
        setUsersData({
          data: data.users || [],
          page: data.page,
          pages: data.pages,
        });
      }

      if (coursesResult.status === "fulfilled" && coursesResult.value.ok) {
        const data = await coursesResult.value.json();
        setCoursesData({
          data: data.courses || [],
          page: data.page,
          pages: data.pages,
        });
      }
    } catch (err) {
      console.error("Admin load error", err);
    } finally {
      setLoading(false);
    }
  }, [token, usersPage, coursesPage]);

  // Redirect if unauthorized
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "admin") {
      navigate("/");
      return;
    }

    if (token) fetchAdminData();
  }, [user, navigate, token, usersPage, coursesPage, fetchAdminData]);

  // ================================
  // Handle User Blocking
  // ================================
  const toggleBlock = async (userId, block) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/block`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ block }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to update user");
        return;
      }

      setUsersData(prev => ({ ...prev, data: prev.data.map(u => u._id === userId ? { ...u, isBlocked: block } : u) }));
    } catch (err) {
      console.error("Block/Unblock error", err);
      alert("Something went wrong.");
    }
  };

  // ================================
  // Add Course
  // ================================
  const handleAddCourse = async (newCourse) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCourse),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to add course");
      } else {
        alert("Course added successfully!");
        setShowAddCourseModal(false);
        setCoursesPage(1); // Reset to first page to see the new course
      }
    } catch (err) {
      console.error("Add course error", err);
      alert("Something went wrong.");
    }
  };

  // ================================
  // Delete Course
  // ================================
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/courses/${courseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete course");
      } else {
        alert("Course deleted successfully!");
        fetchAdminData();
      }
    } catch (err) {
      console.error("Delete course error", err);
      alert("Something went wrong.");
    }
  };

  // Edit course placeholder
  const handleEditCourse = (courseId) => {
    console.log("Edit course:", courseId);
    alert("Edit functionality not implemented yet.");
  };

  if (!user || user.role !== "admin") return null;

  // ================================
  // Loading Screen
  // ================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>Loading admin data...</p>
      </div>
    );
  }

  // ================================
  // ADMIN PAGE UI
  // ================================
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>

        {/* USERS SECTION */}
        <section className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3">Users</h2>
          {usersData.data.length === 0 ? (
            <p className="text-sm text-slate-400">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="text-left py-2 pr-2">Name</th>
                    <th className="text-left py-2 pr-2">Email</th>
                    <th className="text-left py-2 pr-2">Role</th>
                    <th className="text-left py-2 pr-2">Status</th>
                    <th className="text-left py-2 pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData.data.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b border-slate-800 hover:bg-slate-900/60"
                    >
                      <td className="py-2 pr-2">{u.name}</td>
                      <td className="py-2 pr-2 text-slate-300">{u.email}</td>
                      <td className="py-2 pr-2 text-xs uppercase">{u.role}</td>
                      <td className="py-2 pr-2 text-xs">
                        {u.isBlocked ? (
                          <span className="text-red-400">Blocked</span>
                        ) : (
                          <span className="text-emerald-400">Active</span>
                        )}
                      </td>
                      <td className="py-2 pr-2">
                        {u.role === "admin" ? (
                          <span className="text-xs text-slate-500">(admin)</span>
                        ) : u.isBlocked ? (
                          <button
                            onClick={() => toggleBlock(u._id, false)}
                            className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-xs"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleBlock(u._id, true)}
                            className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-xs"
                          >
                            Block
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {usersData.pages > 1 && (
            <div className="flex justify-end items-center gap-2 mt-4 text-sm">
              <button onClick={() => setUsersPage(p => Math.max(1, p - 1))} disabled={usersData.page === 1} className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed">
                Prev
              </button>
              <span>
                Page {usersData.page} of {usersData.pages}
              </span>
              <button onClick={() => setUsersPage(p => Math.min(usersData.pages, p + 1))} disabled={usersData.page === usersData.pages} className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          )}
        </section>

        {/* COURSES SECTION */}
        <section className="bg-slate-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Courses</h2>
            <button
              onClick={() => setShowAddCourseModal(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-semibold"
            >
              + Add New Course
            </button>
          </div>

          {coursesData.data.length === 0 ? (
            <p className="text-sm text-slate-400">No courses found.</p>
          ) : (
            <div className="space-y-2">
              {coursesData.data.map((c) => (
                <div
                  key={c._id}
                  className="bg-slate-900 rounded-lg p-3 text-sm flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{c.title}</p>
                    <p className="text-xs text-slate-400">
                      {c.category || "Uncategorized"} • {c.level} •{" "}
                      {c.instructor
                        ? `Instructor: ${c.instructor.name}`
                        : "No instructor"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCourse(c._id)}
                      className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(c._id)}
                      className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {coursesData.pages > 1 && (
            <div className="flex justify-end items-center gap-2 mt-4 text-sm">
              <button onClick={() => setCoursesPage(p => Math.max(1, p - 1))} disabled={coursesData.page === 1} className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed">
                Prev
              </button>
              <span>
                Page {coursesData.page} of {coursesData.pages}
              </span>
              <button onClick={() => setCoursesPage(p => Math.min(coursesData.pages, p + 1))} disabled={coursesData.page === coursesData.pages} className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          )}
        </section>
      </div>

      {showAddCourseModal && (
        <AddCourseModal
          onClose={() => setShowAddCourseModal(false)}
          onAddCourse={handleAddCourse}
          instructorId={user._id}
        />
      )}
    </div>
  );
}

// ================================
// Add Course Modal Component
// ================================
function AddCourseModal({ onClose, onAddCourse, instructorId }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    instructor: "", // Will be set by admin
    isApproved: true,
  });

  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const [instructors, setInstructors] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onAddCourse(form);
    setLoading(false);
  };

  // Fetch instructors to populate the dropdown
  useEffect(() => {
    const fetchInstructors = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/admin/instructors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setInstructors(data.instructors || []);
        }
      } catch (error) {
        console.error("Failed to fetch instructors", error);
      }
    };
    fetchInstructors();
  }, [token]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-xl w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <fieldset disabled={loading} className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Add New Course</h2>

            <div>
              <label className="block text-sm mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Description</label>
              <textarea
                name="description"
                rows="3"
                value={form.description}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Level</label>
              <select
                name="level"
                value={form.level}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm"
              >
                {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Instructor</label>
              <select
                name="instructor"
                value={form.instructor}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm outline-none"
                required
              >
                <option value="">-- Select an Instructor --</option>
                {instructors.map(inst => (
                  <option key={inst._id} value={inst._id}>
                    {inst.name} ({inst.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isApproved"
                name="isApproved"
                checked={form.isApproved}
                onChange={handleChange}
                className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="isApproved" className="text-sm">Approve this course immediately</label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm"
              >
                {loading ? "Adding..." : "Add Course"}
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default AdminDashboard;

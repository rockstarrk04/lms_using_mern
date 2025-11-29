import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../api/client";

function CreateCourse() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to create course." }));
        throw new Error(errorData.message);
      }

      toast.success("Course created successfully!");
      navigate("/instructor/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Create a New Course
        </h1>
        <p className="mt-2 text-lg text-slate-400">
          Fill out the details below to start building your new course.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4 rounded-md">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Course Title</label>
            <input id="title" name="title" type="text" required value={formData.title} onChange={handleInputChange} className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-white placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Course Description</label>
            <textarea id="description" name="description" rows={4} required value={formData.description} onChange={handleInputChange} className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-white placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">Category</label>
            <input id="category" name="category" type="text" required value={formData.category} onChange={handleInputChange} className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-white placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-slate-300 mb-1">Level</label>
            <select id="level" name="level" value={formData.level} onChange={handleInputChange} className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-white placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>All Levels</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-4 border-t border-slate-700 pt-6">
          <Link to="/instructor/dashboard" className="rounded-lg bg-slate-700 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-slate-600">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition-all duration-300 ease-in-out hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Creating..." : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCourse;
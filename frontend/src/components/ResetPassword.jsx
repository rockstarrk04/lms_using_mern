import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

function ResetPassword() {
  const { resetToken } = useParams(); // Get the token from the URL
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Reset error on new submission

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Your API call to reset the password would go here
    console.log("Submitting new password with token:", {
      password: formData.password,
      token: resetToken,
    });

    setIsSubmitted(true);
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-slate-700/50 bg-slate-800/60 p-8 shadow-lg backdrop-blur-sm">
        {isSubmitted ? (
          <div>
            <h2 className="text-center text-3xl font-bold tracking-tight text-white">
              Password Reset Successful
            </h2>
            <p className="mt-4 text-center text-slate-300">
              You can now log in with your new password.
            </p>
            <div className="mt-6">
              <Link
                to="/login"
                className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition-all duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              >
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-center text-3xl font-bold tracking-tight text-white">
                Set a new password
              </h2>
              <p className="mt-2 text-center text-sm text-slate-400">
                Please enter and confirm your new password below.
              </p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-white placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="New Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-white placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Confirm New Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition-all duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75">
                Reset Password
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

export default ResetPassword;
import React, { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Your API call to send the reset link would go here
    console.log("Password reset requested for:", email);
    setIsSubmitted(true);
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-slate-700/50 bg-slate-800/60 p-8 shadow-lg backdrop-blur-sm">
        {isSubmitted ? (
          <div>
            <h2 className="text-center text-3xl font-bold tracking-tight text-white">
              Check your inbox
            </h2>
            <p className="mt-4 text-center text-slate-300">
              If an account with that email exists, we've sent a link to reset
              your password.
            </p>
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="font-medium text-blue-500 hover:text-blue-400"
              >
                &larr; Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-center text-3xl font-bold tracking-tight text-white">
                Forgot your password?
              </h2>
              <p className="mt-2 text-center text-sm text-slate-400">
                No problem. Enter your email address below and we'll send you a
                link to reset it.
              </p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-white placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition-all duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75">
                Send Reset Link
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

export default ForgotPassword;
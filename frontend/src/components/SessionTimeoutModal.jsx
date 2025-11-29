import React from 'react';

function SessionTimeoutModal({ onStay, onLogout }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-xl bg-slate-800 p-8 shadow-lg text-white">
        <h2 className="text-2xl font-bold" id="modal-title">Session Timeout</h2>
        <p className="mt-4 text-slate-300">
          You've been inactive for a while. For your security, you will be logged out soon.
        </p>
        <p className="mt-2 text-slate-300">Do you want to stay logged in?</p>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onLogout}
            className="rounded-lg bg-slate-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-600"
          >
            Log Out Now
          </button>
          <button
            onClick={onStay}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
}

export default SessionTimeoutModal;
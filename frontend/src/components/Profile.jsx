import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Assuming login function updates user in context
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../api/client";

function Profile() {
  const { user, token, login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // State for profile details
  const [name, setName] = useState(user?.name || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [initialName, setInitialName] = useState(user?.name || "");

  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in passwordData) {
      setPasswordData({ ...passwordData, [name]: value });
    } else if (name === 'name') {
      setName(value);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/update-profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to update profile.');
      const updatedUser = await response.json();
      login(updatedUser.user, token); // Update user in context
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleCancelProfileUpdate = () => {
    setName(initialName);
    setAvatarFile(null);
    setAvatarPreview(user?.avatar || "");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to update password." }));
        throw new Error(errorData.message);
      }
      toast.success("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          My Profile
        </h1>
        <p className="mt-2 text-lg text-slate-400">
          Manage your account settings.
        </p>
      </header>

      {/* Update Profile Details Section */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-8 mb-10">
        <h2 className="text-2xl font-bold text-white">Profile Information</h2>
        <form onSubmit={handleProfileUpdate} className="mt-6 space-y-6 max-w-md">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Profile Picture</label>
            <div className="mt-2 flex items-center gap-x-3">
              <img src={avatarPreview || `https://ui-avatars.com/api/?name=${user?.name}&background=0284c7&color=fff`} alt="Avatar preview" className="h-20 w-20 rounded-full object-cover" />
              <input type="file" name="avatar" id="avatar" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600" />
            </div>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <input id="name" name="name" type="text" required value={name} onChange={handleInputChange} className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-white" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <input id="email" name="email" type="email" disabled value={user?.email || ''} className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-slate-400 cursor-not-allowed" />
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={handleCancelProfileUpdate} className="rounded-lg bg-slate-700 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-slate-600">
              Cancel
            </button>
            <button type="submit" disabled={profileLoading} className="rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60">
              {profileLoading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-8">
        <h2 className="text-2xl font-bold text-white">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="mt-6 space-y-6 max-w-md">
          <div>
            <label htmlFor="currentPassword"
                   className="block text-sm font-medium text-slate-300 mb-1">Current Password</label>
            <input id="currentPassword" name="currentPassword" type="password" required value={passwordData.currentPassword} onChange={handleInputChange} className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-white" />
          </div>
          <div>
            <label htmlFor="newPassword"
                   className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
            <input id="newPassword" name="newPassword" type="password" required value={passwordData.newPassword} onChange={handleInputChange} className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-white" />
          </div>
          <div>
            <label htmlFor="confirmPassword"
                   className="block text-sm font-medium text-slate-300 mb-1">Confirm New Password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" required value={passwordData.confirmPassword} onChange={handleInputChange} className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-white" />
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })} className="rounded-lg bg-slate-700 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-slate-600">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60">
              {loading ? "Saving..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
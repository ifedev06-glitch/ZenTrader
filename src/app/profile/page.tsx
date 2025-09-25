'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { SideBar } from "@/components/SideBar";
import { getProfile, updateProfile } from "@/lib/api";

interface UserProfile {
  username: string;
  email: string;
  subscriptionStatus: string;
  dateJoined?: string;
}

export default function Profile() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    email: "",
    subscriptionStatus: "",
    dateJoined: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<UserProfile>(profile);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setForm(data);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateProfile(form);
      setProfile(updated);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Determine subscription status color
  const subscriptionColor = profile.subscriptionStatus === "SUBSCRIBED" ? "text-green-400 border-green-400" : "text-red-400 border-red-400";

  return (
    <div className="flex min-h-screen bg-gray-900 text-white relative">
      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 bg-gray-800 p-6 w-64 z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:sticky md:top-0
        `}
      >
        <SideBar onLogout={handleLogout} />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 p-6 md:p-8 overflow-y-auto ml-0 md:ml-64 space-y-6">
        {/* Mobile hamburger */}
        <div className="flex items-center justify-between md:hidden mb-4">
          <button
            className="p-3 bg-gray-800 rounded-md"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6 text-blue-400" />
          </button>
        </div>

        <h2 className="text-2xl font-bold text-blue-400">Profile</h2>

        <div className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">{profile.username}</h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium bg-gray-700 ${subscriptionColor} border ${subscriptionColor}`}
            >
              {profile.subscriptionStatus === "SUBSCRIBED" ? "Subscribed" : "inActive"}
            </span>
          </div>

          {/* Form or View */}
          {editMode ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Username</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 text-gray-300">
              <p>
                <span className="font-semibold text-gray-400">Username: </span>
                {profile.username}
              </p>
              <p>
                <span className="font-semibold text-gray-400">Email: </span>
                {profile.email}
              </p>
              {profile.dateJoined && (
                <p>
                  <span className="font-semibold text-gray-400">Date Joined: </span>
                  {profile.dateJoined}
                </p>
              )}
              <p>
                <span className="font-semibold text-gray-400">Subscription Status: </span>
                <span className={subscriptionColor}>
                  {profile.subscriptionStatus === "SUBSCRIBED" ? "Subscribed" : "inActive"}
                </span>
              </p>
            </div>
          )}

          {/* Edit Button */}
          {!editMode && (
            <div className="flex justify-end">
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

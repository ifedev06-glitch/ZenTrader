'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SideBar } from "@/components/SideBar";
import { Menu } from "lucide-react";
import { getTradeDetails, saveTradeDetails, TradeDetails } from "@/lib/api";

export default function TradeDetailsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Trading details state
  const [tradeServer, setTradeServer] = useState("");
  const [tradeUsername, setTradeUsername] = useState("");
  const [tradePassword, setTradePassword] = useState("");

  const [loading, setLoading] = useState(true);

  // Fetch trade details on mount
  useEffect(() => {
    async function fetchDetails() {
      try {
        const details: TradeDetails = await getTradeDetails();
        setTradeServer(details.tradeServer || "");
        setTradeUsername(details.username || "");
        setTradePassword(details.password || "");
      } catch (err) {
        console.error("Failed to load trade details", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, []);

  // ✅ Logout function passed to Sidebar
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleSave = async () => {
    try {
      const newDetails: TradeDetails = {
        tradeServer,
        username: tradeUsername,
        password: tradePassword,
      };
      await saveTradeDetails(newDetails);
      console.log("Trade details saved successfully");
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to save trade details", err);
      alert("Failed to save trade details");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white relative">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-800 p-6 w-64 z-40
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
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto ml-0 md:ml-64">
        {/* Top bar with hamburger */}
        <div className="flex items-center justify-between md:hidden mb-4">
          <button
            className="p-3 bg-gray-800 rounded-md"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6 text-blue-400" />
          </button>
        </div>

        {/* Trading Details Card */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-6 max-w-3xl mx-auto">
          <h2 className="text-blue-400 text-2xl font-bold mb-4">Trading Details</h2>
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <div className="space-y-2 text-gray-300">
              <p>
                <span className="font-semibold text-gray-400">Trade Server: </span>
                {tradeServer || "Not set"}
              </p>
              <p>
                <span className="font-semibold text-gray-400">Username: </span>
                {tradeUsername || "Not set"}
              </p>
              <p>
                <span className="font-semibold text-gray-400">Password: </span>
                {tradePassword ? "••••••••" : "Not set"}
              </p>
            </div>
          )}
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-white font-semibold transition"
          >
            Add Trading Details
          </button>
        </div>
      </main>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
        >
          <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 id="modal-title" className="text-xl font-semibold text-blue-400 mb-4">
              Change Trading Details
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="tradeServer" className="block text-gray-300 mb-1 font-medium">
                  Trade Server
                </label>
                <input
                  id="tradeServer"
                  type="text"
                  value={tradeServer}
                  onChange={(e) => setTradeServer(e.target.value)}
                  className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label htmlFor="tradeUsername" className="block text-gray-300 mb-1 font-medium">
                  Username
                </label>
                <input
                  id="tradeUsername"
                  type="text"
                  value={tradeUsername}
                  onChange={(e) => setTradeUsername(e.target.value)}
                  className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label htmlFor="tradePassword" className="block text-gray-300 mb-1 font-medium">
                  Password
                </label>
                <input
                  id="tradePassword"
                  type="password"
                  value={tradePassword}
                  onChange={(e) => setTradePassword(e.target.value)}
                  className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 transition font-semibold text-white"
                >
                  Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

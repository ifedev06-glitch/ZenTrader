'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CurrencyPairs } from "@/components/currencypairs";
import { SideBar } from "@/components/SideBar";
import { ArrowUpRight, ArrowDownRight, Menu } from "lucide-react";
import { getTradeDetails, getTrades, Trade, getProfile, UserProfile } from "@/lib/api";

const ITEMS_PER_PAGE = 5;

export default function Dashboard() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tradeDetails, setTradeDetails] = useState({ tradeServer: "", username: "", password: "" });
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch trade details, trade history, and profile
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [details, tradesData, userProfile] = await Promise.all([
          getTradeDetails(),
          getTrades(),
          getProfile(),
        ]);

        setTradeDetails(details);
        setTradeHistory(Array.isArray(tradesData) ? tradesData : []); // ✅ safe
        setProfile(userProfile);
      } catch (error) {
        console.error("Failed to load data:", error);
        setTradeHistory([]); // fallback
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedTrades = tradeHistory.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(tradeHistory.length / ITEMS_PER_PAGE);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white relative">

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 bg-gray-800 p-6 w-64 z-40 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 md:sticky md:top-0`}>
        <SideBar onLogout={handleLogout} />
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto ml-0 md:ml-64 flex flex-col">

        {/* Mobile top bar */}
        <div className="flex items-center justify-between md:hidden mb-4">
          <button className="p-3 bg-gray-800 rounded-md" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-6 h-6 text-blue-400" />
          </button>
        </div>

        {/* 🌟 Trade Details Card */}
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 shadow space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-blue-400">Welcome</h3>
              <p className="text-sm text-gray-300 mt-0.5">{tradeDetails.username || "ZenTraderUser"}</p>
            </div>
            <div className="flex items-center h-full">
              {profile?.subscriptionStatus === "SUBSCRIBED" ? (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-green-400 border border-green-400 shadow">
                  Subscribed
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-red-400 border border-red-400 shadow">
                  Inactive
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-gray-700" />

          {/* Trading details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900 rounded-md px-3 py-2 shadow-inner border border-gray-800">
              <p className="text-xs text-gray-400">Trade Server</p>
              <p className="text-sm font-medium text-white mt-0.5">{tradeDetails.tradeServer || "server01.zentrader.com"}</p>
            </div>
            <div className="bg-gray-900 rounded-md px-3 py-2 shadow-inner border border-gray-800">
              <p className="text-xs text-gray-400">Username</p>
              <p className="text-sm font-medium text-white mt-0.5">{tradeDetails.username || "zen_user_99"}</p>
            </div>
            <div className="bg-gray-900 rounded-md px-3 py-2 shadow-inner border border-gray-800">
              <p className="text-xs text-gray-400">Password</p>
              <p className="text-sm font-medium text-white mt-0.5">{tradeDetails.password ? "••••••••" : ""}</p>
            </div>
          </div>
        </div>

        {/* 🌟 Trade History */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Trade History</h3>
            <span className="h-2.5 w-2.5 bg-blue-400 rounded-full" aria-hidden="true" />
          </div>

          {/* Loading / No trades / Trades */}
          {loading ? (
            <p className="text-gray-400">Loading trades...</p>
          ) : paginatedTrades.length === 0 ? (
            <p className="text-gray-400">No trades available.</p>
          ) : (
            <div className="space-y-3">
              {paginatedTrades.map((trade) => {
                const isBuy = trade.type.toUpperCase() === "BUY";
                return (
                  <div key={trade.id} className="flex items-center justify-between bg-gray-800/60 border border-gray-700 p-4 md:p-6 rounded-xl hover:bg-gray-800 transition-all shadow">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 flex items-center justify-center rounded-full ${isBuy ? "bg-green-500/20" : "bg-red-500/20"}`}>
                        {isBuy ? <ArrowUpRight className="text-green-500 w-5 h-5" /> : <ArrowDownRight className="text-red-500 w-5 h-5" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg font-semibold">{trade.pair}</span>
                        <span className="text-sm text-gray-400">{trade.amount}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-1">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${isBuy ? "text-green-500" : "text-red-500"}`}>{trade.type}</span>
                        <span className={`text-sm ${isBuy ? "text-green-500" : "text-red-500"}`}>{trade.percentage}</span>
                      </div>
                      <span className="ml-4 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-500 border border-green-500">
                        {trade.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {paginatedTrades.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="space-x-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-40"
                >
                  Next
                </button>
              </div>
              <span className="text-sm text-gray-400">
                Page {page} of {totalPages}
              </span>
            </div>
          )}

          <div className="flex justify-end">
            <button onClick={() => router.push("/history")} className="text-sm font-medium text-blue-400 hover:underline">
              View All →
            </button>
          </div>
        </div>

        {/* 🌟 Currency Pairs */}
        <div>
          <CurrencyPairs />
        </div>
      </main>
    </div>
  );
}
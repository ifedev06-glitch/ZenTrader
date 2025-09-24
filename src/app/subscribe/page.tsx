'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, CheckCircle2 } from "lucide-react";
import { SideBar } from "@/components/SideBar";
import { getBankDetails, BankDetails } from "@/lib/api";

export default function SubscribePage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [paid, setPaid] = useState(false);
  const [bank, setBank] = useState<BankDetails | null>(null);

  const handlePaid = () => {
    setPaid(true);
    setTimeout(() => {
      setModalOpen(false);
      setPaid(false);
    }, 3500);
  };

  useEffect(() => {
    const fetchBank = async () => {
      try {
        const data = await getBankDetails();
        setBank(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBank();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white relative">
      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 bg-gray-800 p-6 w-64 z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:sticky md:top-0
          rounded-tr-3xl rounded-br-3xl
        `}
      >
        <SideBar
          onLogout={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/login");
          }}
        />
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto ml-0 md:ml-64">
        {/* Mobile Top Bar */}
        <div className="flex items-center justify-between md:hidden mb-6">
          <button
            className="p-3 bg-gray-800 rounded-md"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6 text-blue-400" />
          </button>
          <h1 className="text-xl font-semibold">Subscribe</h1>
          <div className="w-6" />
        </div>

        {/* Subscription Card */}
        <div className="max-w-md mx-auto bg-gradient-to-b from-gray-900/80 via-gray-800/60 to-gray-800/60 border border-gray-700 rounded-3xl p-12 shadow-2xl shadow-black/90 transform hover:scale-[1.03] transition-transform duration-300">
          <h2 className="text-3xl font-extrabold mb-4 text-white drop-shadow-md">ZenTrader Premium</h2>
          <p className="text-gray-300 text-lg mb-10">
            Unlock all features and start trading like a pro.
          </p>

          <div className="flex items-center justify-between mb-12">
            <span className="text-5xl font-bold text-white drop-shadow-md">₦15,000</span>
            <span className="text-sm text-gray-400 uppercase tracking-wide">per month</span>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 active:from-green-800 active:to-green-700 rounded-3xl font-semibold text-white shadow-lg shadow-black/50 transition-all text-lg flex items-center justify-center gap-2"
            aria-label="Subscribe now"
          >
            Subscribe Now
          </button>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-3xl max-w-sm w-full p-8 shadow-2xl shadow-black/80 relative transform scale-100 animate-fadeIn">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
                aria-label="Close modal"
              >
                ✕
              </button>

              {!paid ? (
                <>
                  <h2 className="text-xl font-semibold mb-4 text-center">Payment Instructions</h2>
                  <p className="text-gray-400 text-sm mb-4 text-center">
                    Once payment has been made, click "Paid"
                  </p>

                  <div className="space-y-4 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Account Name
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={bank?.accountName || ""}
                        className="w-full rounded-xl bg-gray-700 border border-gray-600 px-4 py-2 text-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={bank?.accountNumber || ""}
                        className="w-full rounded-xl bg-gray-700 border border-gray-600 px-4 py-2 text-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={bank?.bankName || ""}
                        className="w-full rounded-xl bg-gray-700 border border-gray-600 px-4 py-2 text-gray-300"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handlePaid}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-3xl font-semibold text-white shadow-lg shadow-black/50 transition-all text-lg flex items-center justify-center gap-2"
                    aria-label="Paid"
                  >
                    Paid <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </button>
                </>
              ) : (
                <div className="text-center text-green-400 font-semibold text-lg flex flex-col items-center gap-4">
                  <CheckCircle2 className="w-12 h-12 mx-auto text-green-400" />
                  <p>Your subscription will be updated shortly.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

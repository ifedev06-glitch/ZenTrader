'use client';

import React from "react";
import Link from "next/link";
import {
  LogOut,
  User,
  LayoutDashboard,
  History,
  Star,
} from "lucide-react";

interface SidebarProps {
  onLogout: () => void;
}

export function SideBar({ onLogout }: SidebarProps) {
  return (
    <div className="h-full flex flex-col justify-between bg-gray-800 text-white p-4 md:p-6">
      {/* Header / Brand */}
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-blue-400 tracking-tight">
          ZenTrader<span className="text-white"> Pro</span>
        </h1>

        {/* Main Navigation */}
        <nav className="flex flex-col space-y-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-700 transition"
          >
            <LayoutDashboard className="w-4 h-4 text-blue-400" />
            Dashboard
          </Link>

          <Link
            href="/history"
            className="flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-700 transition"
          >
            <History className="w-4 h-4 text-blue-400" />
            Trade-History
          </Link>

         <Link
            href="/subscribe"
            className="flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-700 transition text-left"
            >
            <Star className="w-4 h-4 text-blue-400" />
            Subscribe
            </Link>

                  <Link
            href="/profile"
            className="flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-700 transition text-left"
          >
            <User className="w-4 h-4 text-blue-400" />
            Profile
          </Link>

                <Link
        href="/connect"
        className="flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-700 transition text-left"
      >
        <User className="w-4 h-4 text-blue-400" />
        Connect Trade Account
      </Link>
        </nav>
      </div>

      {/* Footer Section */}
      <div>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-700 transition text-left w-full"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          Logout
        </button>

        <div className="text-gray-500 text-xs px-3 mt-4">v1.0</div>
      </div>
    </div>
  );
}

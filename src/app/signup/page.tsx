'use client';

import React, { useState } from "react";
import { Lock, Eye, EyeOff, Zap, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/api"; // returns { token: "..." }
import { saveToken } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await signup(username, email, password); // { token: "..." }
      saveToken(data.token); // save JWT
      setSuccess("User signed up successfully, Kindly Login!");
      
      // redirect to login after a short delay
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-3 bg-indigo-500/20 rounded-xl">
              <TrendingUp className="h-8 w-8 text-indigo-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              ZenTrader <span className="text-indigo-500">Pro</span>
            </h1>
          </div>
          <p className="text-gray-400 text-sm">Create your AI-powered trading account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="relative">
            <span className="absolute left-3 top-3 h-5 w-5 text-gray-400">👤</span>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <span className="absolute left-3 top-3 h-5 w-5 text-gray-400">📧</span>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Messages */}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}

          {/* Signup Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg shadow-md transition-all disabled:opacity-50"
          >
            {isLoading ? "Signing Up..." : <div className="flex items-center justify-center space-x-2"><Zap className="h-4 w-4"/> <span>Sign Up</span></div>}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>
            Already have an account? <span className="text-indigo-500 hover:text-indigo-400 cursor-pointer" onClick={() => router.push("/login")}>Login</span>
          </p>
          <p className="mt-2">
            By signing up, you agree to our <span className="text-indigo-500 hover:text-indigo-400 cursor-pointer">Terms</span> and <span className="text-indigo-500 hover:text-indigo-400 cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}

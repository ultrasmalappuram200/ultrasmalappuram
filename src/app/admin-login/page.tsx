'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const AdminLogin = () => {
  const router = useRouter();
  const { signIn, user, isAdmin, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("admin@malappuramfc.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      router.push("/admin");
    }
  }, [user, isAdmin, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Starting login...');
      const result = await signIn(email, password);
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful, checking admin status...');
        console.log('Current user:', user);
        console.log('Current isAdmin:', isAdmin);
        console.log('Result isAdmin:', result.isAdmin);
        
        // Check if user is admin and redirect
        if (result.isAdmin) {
          console.log('User is admin, redirecting to dashboard...');
          router.push("/admin");
        } else {
          console.log('User is not admin, showing access denied...');
          // You could show an error message here
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A1F3C] to-[#0E1229]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-orange-400 border-t-transparent rounded-full mb-4 mx-auto"></div>
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A1F3C] to-[#0E1229] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-orange-400 mb-6 text-center drop-shadow">
          Admin Login
        </h1>
        <p className="text-gray-300 text-center mb-8">
          Enter your admin credentials to access the dashboard
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 rounded-xl bg-[#0E1229] border border-gray-600 text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-500 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 rounded-xl bg-[#0E1229] border border-gray-600 text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-500 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-400 rounded-xl font-semibold text-white text-lg shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-gray-400 hover:text-orange-400 transition-colors"
          >
            ← Back to Website
          </a>
        </div>

        <p className="text-gray-400 text-xs text-center mt-6">
          Protected Admin Access Only
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

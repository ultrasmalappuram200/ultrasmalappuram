import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Simple client-side password (can be moved to backend later)
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "malappuramfc";

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem("isAdmin", "true");
        toast.success("Welcome back, Admin!");
        navigate("/admin");
      } else {
        toast.error("Incorrect password!");
      }
      setLoading(false);
    }, 800);
  };

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
          Enter the admin password to access the dashboard
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
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
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-400 rounded-xl font-semibold text-white text-lg shadow-md hover:shadow-lg transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-400 text-xs text-center mt-6">
          Protected Admin Access Only
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

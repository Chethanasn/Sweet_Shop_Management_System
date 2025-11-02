import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import sweetLogo from "../assets/sweet-logo.png";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [fadeIn, setFadeIn] = useState(false); // 👈 animation trigger

  const API_URL = "http://localhost:5000/api/auth/login";

  useEffect(() => {
    // trigger fade-in after mount
    const t = setTimeout(() => setFadeIn(true), 400);
    return () => clearTimeout(t);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(API_URL, {
        email: email.trim(),
        password: password.trim(),
        role,
      });

      toast.success(res.data.message || "Login successful!");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      setTimeout(() => {
        if (res.data.role === "admin") navigate("/admin");
        else navigate("/user");
      }, 1000);
    } catch (err: any) {
      console.error("❌ Login Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Please enter your email!");
      return;
    }

    toast.success("If this email exists, password reset instructions will be sent!");
    setResetEmail("");
    setShowForgot(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3B2F2F] via-[#2E1A12] to-[#C77D24] text-white px-4">
      {/* ✅ Toast */}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#2E1A12",
            color: "#fff",
            borderRadius: "10px",
            padding: "12px 18px",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#C77D24", secondary: "#fff" },
          },
        }}
      />

      {/* Login Card */}
      <div className="flex flex-col items-center text-center bg-white/10 backdrop-blur-md px-10 py-12 rounded-3xl shadow-2xl border border-white/20 w-[90%] sm:w-[420px] md:w-[480px] relative">
        <img
          src={sweetLogo}
          alt="Sweet Shop Logo"
          className="w-24 h-24 mb-6 animate-[bounce_3s_ease-in-out_infinite]"
          style={{ filter: "drop-shadow(0 0 12px #C77D24)" }}
        />

        <h1 className="text-4xl font-extrabold mb-3 text-[#FFD580]">Login</h1>
        <p className="text-md text-[#FFE7B8] mb-8">
          Welcome back! Please log in 🍬
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-xl bg-white/30 text-white placeholder-[#FFD580] focus:outline-none focus:ring-2 focus:ring-[#C77D24] shadow-sm"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-xl bg-white/30 text-white placeholder-[#FFD580] focus:outline-none focus:ring-2 focus:ring-[#C77D24] shadow-sm"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "user" | "admin")}
            className="p-3 rounded-xl bg-white/30 text-white focus:outline-none focus:ring-2 focus:ring-[#C77D24] shadow-sm"
          >
            <option value="user" className="bg-[#2E1A12] text-white">
              User
            </option>
            <option value="admin" className="bg-[#2E1A12] text-white">
              Admin
            </option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading
                ? "bg-[#a86b1f] cursor-not-allowed"
                : "bg-[#C77D24] hover:bg-[#E67E22]"
            } text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register */}
        <div className="w-full mt-6">
          <p className="text-sm text-[#FFE7B8] text-center">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-[#FFD580] hover:underline"
            >
              Register
            </button>
          </p>
        </div>

        {/* ✅ Forgot Password - clean fade-in bottom-right */}
        <div
          className={`w-full flex justify-end mt-5 pr-2 transition-all duration-1000 ease-out ${
            fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <button
            onClick={() => setShowForgot(true)}
            className="text-[#FFD580] hover:underline text-sm"
          >
            Forgot your password?
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-[#2E1A12] text-white p-8 rounded-2xl shadow-2xl w-[90%] sm:w-[400px]">
            <h2 className="text-2xl font-bold mb-4 text-[#FFD580]">
              Forgot Password
            </h2>
            <p className="text-sm text-[#FFE7B8] mb-4">
              Enter your email to receive reset instructions.
            </p>

            <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="p-3 rounded-xl bg-white/30 text-white placeholder-[#FFD580] focus:outline-none focus:ring-2 focus:ring-[#C77D24]"
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-[#C77D24] hover:bg-[#E67E22] px-5 py-2 rounded-lg font-semibold"
                >
                  Send Link
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="bg-gray-500 hover:bg-gray-600 px-5 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;

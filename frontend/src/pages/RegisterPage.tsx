import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import sweetLogo from "../assets/sweet-logo.png";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:5000/api/auth";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        role,
      });

      toast.success(res.data?.message || "Registered successfully!");
      setTimeout(() => navigate("/"), 800);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Registration failed!";
      toast.error(msg);
      console.error("❌ Registration Error:", err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3B2F2F] via-[#2E1A12] to-[#C77D24] text-white px-4">
      {/* ✅ Bottom Toast */}
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
            iconTheme: {
              primary: "#C77D24",
              secondary: "#fff",
            },
          },
        }}
      />

      <div className="flex flex-col items-center text-center bg-white/10 backdrop-blur-md px-10 py-12 rounded-3xl shadow-2xl border border-white/20 w-[90%] sm:w-[420px] md:w-[480px]">
        {/* Logo */}
        <img
          src={sweetLogo}
          alt="Sweet Shop Logo"
          className="w-24 h-24 mb-6 animate-[bounce_3s_ease-in-out_infinite]"
          style={{ filter: "drop-shadow(0 0 12px #C77D24)" }}
        />

        {/* Heading */}
        <h1 className="text-4xl font-extrabold mb-3 text-[#FFD580]">
          Register
        </h1>
        <p className="text-md text-[#FFE7B8] mb-8">
          Create your account 🍬
        </p>

        {/* Form */}
        <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded-xl bg-white/30 text-white placeholder-[#FFD580] focus:outline-none focus:ring-2 focus:ring-[#C77D24] shadow-sm"
          />

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

          {/* ✅ Role dropdown (visible now) */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-3 rounded-xl bg-white/30 text-white focus:outline-none focus:ring-2 focus:ring-[#C77D24] shadow-sm"
          >
            <option value="user" className="bg-[#2E1A12] text-white">
              User
            </option>
            <option value="admin" className="bg-[#2E1A12] text-white">
              Admin
            </option>
          </select>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading
                ? "bg-[#a86b1f] cursor-not-allowed"
                : "bg-[#C77D24] hover:bg-[#E67E22]"
            } text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Login Redirect */}
        <p className="text-sm text-[#FFE7B8] mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-[#FFD580] hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

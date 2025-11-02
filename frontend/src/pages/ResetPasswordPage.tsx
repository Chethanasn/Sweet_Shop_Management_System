import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import sweetLogo from "../assets/sweet-logo.png";

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill all fields!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { newPassword }
      );

      toast.success(res.data?.message || "Password reset successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Error resetting password. Try again later."
      );
      console.error("❌ Reset Password Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3B2F2F] via-[#2E1A12] to-[#C77D24] text-white px-4">
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#2E1A12",
            color: "#fff",
            borderRadius: "10px",
          },
        }}
      />

      <div className="flex flex-col items-center text-center bg-white/10 backdrop-blur-md px-10 py-12 rounded-3xl shadow-2xl border border-white/20 w-[90%] sm:w-[420px] md:w-[480px]">
        <img
          src={sweetLogo}
          alt="Sweet Shop Logo"
          className="w-24 h-24 mb-6 animate-[bounce_3s_ease-in-out_infinite]"
          style={{ filter: "drop-shadow(0 0 12px #C77D24)" }}
        />

        <h1 className="text-3xl font-extrabold mb-3">Reset Password</h1>
        <p className="text-md text-gray-200 mb-8">
          Enter your new password below 🔒
        </p>

        <form onSubmit={handleReset} className="w-full flex flex-col gap-4">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C77D24]"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C77D24]"
          />

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading
                ? "bg-[#a86b1f] cursor-not-allowed"
                : "bg-[#C77D24] hover:bg-[#E67E22]"
            } text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="text-sm text-gray-300 mt-6">
          Remember your password?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-[#FFD580] hover:underline"
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

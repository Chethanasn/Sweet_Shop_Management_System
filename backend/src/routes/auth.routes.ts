import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer"; // ✅ fixed import style

const router = express.Router();
const prisma = new PrismaClient();

/* ---------------------- EMAIL CONFIG ---------------------- */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* Check email connection (optional but useful) */
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email transporter ready to send messages.");
  }
});

/* ================================
   🔐 REGISTER USER (with role)
================================ */
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required." });

    const userRole =
      role && ["admin", "user"].includes(role.toLowerCase())
        ? role.toLowerCase()
        : "user";

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { name, email, password: hashedPassword, role: userRole },
    });

    console.log(`✅ Registered new ${userRole}: ${email}`);
    return res
      .status(201)
      .json({ message: `User registered successfully as ${userRole}!` });
  } catch (error: any) {
    console.error("❌ Registration Error:", error);
    return res.status(500).json({
      message: "Error registering user.",
      detail: error?.message || String(error),
    });
  }
});

/* ================================
   🔑 LOGIN USER
================================ */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    console.log("🟡 Login attempt:", email, "as", role);

    if (!email || !password || !role)
      return res
        .status(400)
        .json({ message: "Email, password, and role are required." });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid credentials." });

    if (user.role.toLowerCase() !== role.toLowerCase())
      return res
        .status(403)
        .json({ message: `Access denied. You are not a ${role}.` });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "supersecretkey123",
      { expiresIn: "2h" }
    );

    console.log(`✅ ${role.toUpperCase()} Login success: ${email}`);
    return res.json({
      message: "Login successful!",
      token,
      role: user.role,
      name: user.name,
    });
  } catch (error: any) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({
      message: "Error logging in.",
      detail: error?.message || String(error),
    });
  }
});

/* ================================
   📧 FORGOT PASSWORD (send email)
================================ */
router.post("/forgot-password", async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res
        .status(404)
        .json({ message: "No account found with this email." });

    // Create reset token valid for 15 minutes
    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "supersecretkey123",
      { expiresIn: "15m" }
    );

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    // ✅ Send reset email
    try {
      await transporter.sendMail({
        from: `"Sweet Shop 🍬" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset - Sweet Shop",
        html: `
          <div style="font-family: Arial; color: #333;">
            <h2>Reset Your Password</h2>
            <p>Hello <b>${user.name}</b>,</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetLink}" 
               style="display:inline-block;background:#C77D24;color:white;padding:10px 15px;border-radius:6px;text-decoration:none;">
              Reset Password
            </a>
            <p style="margin-top:15px;">If you didn’t request this, ignore this email.</p>
          </div>
        `,
      });

      console.log(`📨 Password reset email sent to ${email}`);
    } catch (mailErr: any) {
      console.error("❌ Email send error:", mailErr.message);
      console.log("🔗 Reset Link (debug):", resetLink); // so you can test manually
    }

    return res.json({
      message:
        "If the email exists, a reset link has been sent. (Check Inbox or Spam)",
    });
  } catch (error: any) {
    console.error("❌ Forgot Password Error:", error);
    return res.status(500).json({ message: "Failed to send reset email." });
  }
});

/* ================================
   🔄 RESET PASSWORD (from email link)
================================ */
router.post("/reset-password/:token", async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    if (!newPassword)
      return res.status(400).json({ message: "New password is required." });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey123"
    ) as { id: number };

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashed },
    });

    console.log(`🔁 Password updated for user ID: ${decoded.id}`);
    return res.json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    return res
      .status(400)
      .json({ message: "Invalid or expired reset token." });
  }
});

export default router;

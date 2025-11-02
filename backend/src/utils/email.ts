import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail", // or "outlook", "yahoo", etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetEmail = async (to: string, resetLink: string) => {
  await transporter.sendMail({
    from: `"Sweet Shop 🍬" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset - Sweet Shop",
    html: `
      <div style="font-family: Arial; color: #333;">
        <h2>Reset Your Password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" style="background: #C77D24; color: white; padding: 10px 15px; border-radius: 6px; text-decoration: none;">Reset Password</a>
        <p style="margin-top: 20px;">If you didn’t request this, ignore this email.</p>
      </div>
    `,
  });
};

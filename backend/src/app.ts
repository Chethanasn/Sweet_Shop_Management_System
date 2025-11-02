import express from "express";
import cors from "cors";
import helmet from "helmet";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.routes";
import sweetRoutes from "./routes/sweet.routes"; // ✅ add this line

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(helmet());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes); // ✅ Mount sweet routes

// ✅ Health check
app.get("/", (_req, res) => {
  res.send("✅ Sweet Shop Backend is Running!");
});

export default app;

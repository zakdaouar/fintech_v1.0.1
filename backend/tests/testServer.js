import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "../src/routes/auth.js";

export default function appInit() {
  const app = express();
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use("/api/auth", authRoutes);
  return app;
}

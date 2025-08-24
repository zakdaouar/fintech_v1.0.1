import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import customersRoutes from "./routes/customers.js";
import transfersRoutes from "./routes/transfers.js";
import transactionsRoutes from "./routes/transactions.js";
import accountsRoutes from "./routes/accounts.js";
import webhooksRoutes from "./routes/webhooks.js";

dotenv.config();
const app = express();

// Webhook route first with raw body
app.use("/api/webhooks/bridge", webhooksRoutes);

// Standard middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/transfers", transfersRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/accounts", accountsRoutes);

// Health
app.get("/health", (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Backend running on :${port}`));

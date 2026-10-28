import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
 console.error("MONGO_URI is required. Configure server/.env before starting the API.");
 process.exit(1);
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET === "change_this_to_a_long_random_secret") {
 console.error("JWT_SECRET must be a private random value of at least 32 characters.");
 process.exit(1);
}

app.use(cors({
 origin: process.env.CLIENT_URL || "http://localhost:5173"
}));
app.use(express.json());

app.get("/api/health", (req, res) => {
 res.json({ message: "EasyBank API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

app.use((err, req, res, next) => {
 const status = err.status || 500;
 console.error(`Request failed (${err.name || "Error"}, status ${status}).`);
 res.status(status).json({
 message: status >= 500 ? "An unexpected server error occurred." : err.message || "Something went wrong"
 });
});

mongoose.connect(process.env.MONGO_URI)
 .then(() => {
 console.log("MongoDB connected");
 app.listen(PORT, () => {
 console.log(`EasyBank server running on http://localhost:${PORT}`);
 });
 })
 .catch((error) => {
 console.error("MongoDB connection failed:", error.name || "DatabaseError");
 process.exit(1);
 });

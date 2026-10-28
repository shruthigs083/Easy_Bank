import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function makeToken(userId) {
 return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function safeUser(user) {
 return {
 id: user._id,
 name: user.name,
 email: user.email,
 phone: user.phone,
 balance: user.balance
 };
}

export async function register(req, res, next) {
 try {
 const { name, email, password, phone, initialBalance } = req.body || {};

 if (
 typeof name !== "string" || name.trim().length < 2 || name.trim().length > 80 ||
 typeof email !== "string" || !email.trim() ||
 typeof password !== "string" || !password
 ) {
 return res.status(400).json({ message: "Name, email and password are required." });
 }

 const normalizedEmail = email.trim().toLowerCase();
 if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
 return res.status(400).json({ message: "Enter a valid email address." });
 }

 if (typeof phone !== "string") {
 return res.status(400).json({ message: "Enter a valid 10-digit phone number." });
 }

 const normalizedPhone = phone.replace(/\D/g, "");
 if (!/^\d{10}$/.test(normalizedPhone)) {
 return res.status(400).json({ message: "Enter a valid 10-digit phone number." });
 }

 if (password.length < 6) {
 return res.status(400).json({ message: "Password must be at least 6 characters." });
 }

 const startingBalance = Number(initialBalance);

 if (
 initialBalance === undefined || initialBalance === null || String(initialBalance).trim() === "" ||
 !Number.isFinite(startingBalance) || startingBalance < 0 || startingBalance > 1000000
 ) {
 return res.status(400).json({ message: "Starting balance must be between ₹0 and ₹10,00,000." });
 }

 const existing = await User.findOne({ email: normalizedEmail });

 if (existing) {
 return res.status(409).json({ message: "An account with this email already exists." });
 }

 const existingPhone = await User.findOne({ phone: normalizedPhone });
 if (existingPhone) {
 return res.status(409).json({ message: "An account with this phone number already exists." });
 }

 const hashedPassword = await bcrypt.hash(password, 12);

 const user = await User.create({
 name: name.trim(),
 email: normalizedEmail,
 password: hashedPassword,
 phone: normalizedPhone,
 balance: startingBalance
 });

 res.status(201).json({
 token: makeToken(user._id.toString()),
 user: safeUser(user)
 });
 } catch (error) {
 next(error);
 }
}

export async function login(req, res, next) {
 try {
 const { email, password } = req.body || {};

 if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
 return res.status(400).json({ message: "Please enter your email and password." });
 }

 const user = await User.findOne({ email: email.trim().toLowerCase() });

 if (!user || !(await bcrypt.compare(password, user.password))) {
 return res.status(401).json({ message: "Email or password is incorrect." });
 }

 res.json({
 token: makeToken(user._id.toString()),
 user: safeUser(user)
 });
 } catch (error) {
 next(error);
 }
}

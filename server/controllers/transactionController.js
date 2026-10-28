import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export async function listTransactions(req, res, next) {
 try {
 const transactions = await Transaction.find({ user: req.user._id })
 .populate("relatedUser", "name email")
 .sort({ createdAt: -1 })
 .limit(100);

 res.json({ transactions });
 } catch (error) {
 next(error);
 }
}

export async function sendMoney(req, res, next) {
 let sender;
 let recipient;

 try {
 const { recipientPhone, amount } = req.body || {};
 const value = Number(amount);

 const phone = String(recipientPhone || "").replace(/\D/g, "");

 if (!/^\d{10}$/.test(phone) || !Number.isFinite(value) || value <= 0) {
 return res.status(400).json({ message: "Enter a valid recipient and amount." });
 }

 if (value > 100000) {
 return res.status(400).json({ message: "In this educational demo, transfers cannot exceed ₹1,00,000." });
 }

 const recipients = await User.find({ phone }).limit(2);

 if (!recipients.length) {
 return res.status(404).json({ message: "Recipient account was not found." });
 }

 if (recipients.length > 1) {
 return res.status(409).json({ message: "More than one account uses this phone number. Contact support before transferring." });
 }

 recipient = recipients[0];

 if (recipient._id.equals(req.user._id)) {
 return res.status(400).json({ message: "You cannot send money to yourself." });
 }

 // Atomic sender-side balance check/update. This also works with a normal
 // local MongoDB server, unlike multi-document transactions which require
 // a replica set.
 sender = await User.findOneAndUpdate(
 { _id: req.user._id, balance: { $gte: value } },
 { $inc: { balance: -value } },
 { new: true }
 );

 if (!sender) {
 return res.status(400).json({ message: "You do not have enough balance." });
 }

 try {
 await User.findByIdAndUpdate(recipient._id, { $inc: { balance: value } });

 await Transaction.create([
 {
 user: sender._id,
 type: "debit",
 category: "transfer",
 amount: value,
 description: `Money sent to ${recipient.name}`,
 relatedUser: recipient._id
 },
 {
 user: recipient._id,
 type: "credit",
 category: "transfer",
 amount: value,
 description: `Money received from ${sender.name}`,
 relatedUser: sender._id
 }
 ]);
 } catch (operationError) {
 // Best-effort rollback for this educational transfer.
 await User.findByIdAndUpdate(sender._id, { $inc: { balance: value } }).catch(() => {});
 await User.findByIdAndUpdate(recipient._id, { $inc: { balance: -value } }).catch(() => {});
 throw operationError;
 }

 res.json({
 message: `₹${value.toFixed(2)} was sent successfully.`,
 balance: sender.balance
 });
 } catch (error) {
 next(error);
 }
}

export async function payDemoBill(req, res, next) {
 try {
 const { category, provider, accountNumber, amount } = req.body || {};
 const value = Number(amount);
 const account = String(accountNumber || "").trim();

 if (!["recharge", "bill"].includes(category)) {
 return res.status(400).json({ message: "Choose a valid payment type." });
 }

 const allowedProviders = category === "recharge"
 ? ["Jio", "Airtel", "Vi", "BSNL"]
 : ["electricity", "water", "gas", "dth", "internet"];

 if (
 !allowedProviders.includes(provider) || !account || account.length > 64 ||
 !Number.isFinite(value) || value <= 0 || value > 100000
 ) {
 return res.status(400).json({ message: "Enter valid payment details. Payment amount cannot exceed ₹1,00,000." });
 }

 if (category === "recharge" && !/^\d{10}$/.test(account)) {
 return res.status(400).json({ message: "Enter a valid 10-digit mobile number." });
 }

 if (category === "bill" && account.length < 4) {
 return res.status(400).json({ message: "Enter a valid consumer/account number." });
 }

 const user = await User.findOneAndUpdate(
 { _id: req.user._id, balance: { $gte: value } },
 { $inc: { balance: -value } },
 { new: true }
 );

 if (!user) {
 return res.status(400).json({ message: "You do not have enough balance." });
 }

 try {
 const transaction = await Transaction.create({
 user: user._id,
 type: "debit",
 category: category === "recharge" ? "recharge" : "bill",
 amount: value,
 description: `${category === "recharge" ? "Recharge" : "Bill payment"} - ${provider} - ${account}`
 });

 res.json({
 message: "Payment completed successfully in the demo app.",
 balance: user.balance,
 transaction
 });
 } catch (error) {
 await User.findByIdAndUpdate(user._id, { $inc: { balance: value } }).catch(() => {});
 throw error;
 }
 } catch (error) {
 next(error);
 }
}

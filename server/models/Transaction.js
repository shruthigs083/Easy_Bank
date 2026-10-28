import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
 {
 user: {
 type: mongoose.Schema.Types.ObjectId,
 ref: "User",
 required: true
 },
 type: {
 type: String,
 enum: ["credit", "debit"],
 required: true
 },
 category: {
 type: String,
 enum: ["transfer", "recharge", "bill", "deposit", "other"],
 default: "other"
 },
 amount: {
 type: Number,
 required: true,
 min: 0.01
 },
 description: {
 type: String,
 required: true,
 trim: true
 },
 relatedUser: {
 type: mongoose.Schema.Types.ObjectId,
 ref: "User",
 default: null
 }
 },
 { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);

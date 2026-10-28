import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
 {
 name: { type: String, required: true, trim: true, maxlength: 80 },
 phone: { type: String, required: true, trim: true },
 userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
 },
 { _id: true }
);

const userSchema = new mongoose.Schema(
 {
 name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
 email: { type: String, required: true, unique: true, lowercase: true, trim: true },
 password: { type: String, required: true },
 phone: { type: String, trim: true, default: "" },
 balance: { type: Number, required: true, min: 0, max: 1000000 },
 contacts: { type: [contactSchema], default: [] }
 },
 { timestamps: true }
);

export default mongoose.model("User", userSchema);

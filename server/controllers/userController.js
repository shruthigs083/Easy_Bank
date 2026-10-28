import User from "../models/User.js";

function safeUser(user) {
 return {
 id: user._id,
 name: user.name,
 email: user.email,
 phone: user.phone,
 balance: user.balance
 };
}

export async function me(req, res) {
 res.json({ user: safeUser(req.user) });
}

export async function findRecipient(req, res, next) {
 try {
 const query = String(req.query.q || "").trim();
 if (!query) return res.status(400).json({ message: "Enter a name or phone number." });

 const normalizedPhone = query.replace(/\D/g, "");
 const conditions = [
 { name: new RegExp(`^${query.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`, "i") },
 { email: query.toLowerCase() }
 ];
 if (/^\d{10}$/.test(normalizedPhone)) conditions.unshift({ phone: normalizedPhone });

 const users = await User.find({ $or: conditions, _id: { $ne: req.user._id } })
 .select("name email phone")
 .limit(8);

 if (!users.length) return res.status(404).json({ message: "No EasyBank user was found." });
 res.json({ users });
 } catch (error) { next(error); }
}

export async function listContacts(req, res, next) {
 try {
 const user = await User.findById(req.user._id).select("contacts").populate("contacts.userId", "name phone email");
 res.json({ contacts: user?.contacts || [] });
 } catch (error) { next(error); }
}

export async function addContact(req, res, next) {
 try {
 const name = String(req.body.name || "").trim();
 const phone = String(req.body.phone || "").replace(/\D/g, "");
 if (!name || !/^\d{10}$/.test(phone)) return res.status(400).json({ message: "Enter a contact name and valid 10-digit phone number." });

 const contactUser = await User.findOne({ phone }).select("_id name phone email");
 if (!contactUser) return res.status(404).json({ message: "No EasyBank user was found with this phone number." });
 if (contactUser._id.equals(req.user._id)) return res.status(400).json({ message: "You cannot add yourself as a contact." });

 const exists = req.user.contacts?.some((c) => c.userId.equals(contactUser._id));
 if (exists) return res.status(409).json({ message: "This contact is already saved." });

 req.user.contacts.push({ name, phone, userId: contactUser._id });
 await req.user.save();
 res.status(201).json({ contact: req.user.contacts.at(-1) });
 } catch (error) { next(error); }
}

export async function deleteContact(req, res, next) {
 try {
 const contact = req.user.contacts.id(req.params.contactId);
 if (!contact) return res.status(404).json({ message: "Contact not found." });
 contact.deleteOne();
 await req.user.save();
 res.json({ message: "Contact removed." });
 } catch (error) { next(error); }
}

import express from "express";
import { me, findRecipient, listContacts, addContact, deleteContact } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.get("/me", protect, me);
router.get("/recipient", protect, findRecipient);
router.get("/contacts", protect, listContacts);
router.post("/contacts", protect, addContact);
router.delete("/contacts/:contactId", protect, deleteContact);
export default router;

import express from "express";
import {
 listTransactions,
 sendMoney,
 payDemoBill
} from "../controllers/transactionController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, listTransactions);
router.post("/send", protect, sendMoney);
router.post("/pay", protect, payDemoBill);

export default router;

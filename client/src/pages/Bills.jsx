import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Smartphone, Zap, Droplets, Flame, Tv, Wifi } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import api from "../services/api.js";

const rechargeOperators = ["Jio", "Airtel", "Vi", "BSNL"];
const billTypes = [
 { value: "electricity", labelKey: "electricity", icon: Zap },
 { value: "water", labelKey: "water", icon: Droplets },
 { value: "gas", labelKey: "gas", icon: Flame },
 { value: "dth", labelKey: "dth", icon: Tv },
 { value: "internet", labelKey: "internet", icon: Wifi }
];

export default function Bills() {
 const { user, updateUser } = useAuth();
 const { t } = useLanguage();
 const [category, setCategory] = useState("recharge");
 const [provider, setProvider] = useState("");
 const [accountNumber, setAccountNumber] = useState("");
 const [amount, setAmount] = useState("");
 const [message, setMessage] = useState("");
 const [error, setError] = useState("");
 const [busy, setBusy] = useState(false);

 const quickAmounts = useMemo(() => category === "recharge" ? [199, 299, 399, 499] : [500, 1000, 1500, 2000], [category]);
 const selectedBill = billTypes.find((item) => item.value === provider);
 const AccountIcon = category === "recharge" ? Smartphone : (selectedBill?.icon || Zap);

 function switchCategory(next) {
 setCategory(next);
 setProvider("");
 setAccountNumber("");
 setAmount("");
 setMessage("");
 setError("");
 }

 function validate() {
 const value = Number(amount);
 if (!provider || !accountNumber.trim() || !Number.isFinite(value) || value <= 0) {
 setError(t("enterAll"));
 return false;
 }
 if (category === "recharge" && !/^\d{10}$/.test(accountNumber.trim())) {
 setError(t("invalidMobile"));
 return false;
 }
 if (category === "bill" && accountNumber.trim().length < 4) {
 setError(t("invalidConsumerNumber"));
 return false;
 }
 if (value > 100000) {
 setError(t("paymentLimit"));
 return false;
 }
 if (value > user.balance) {
 setError(t("notEnough"));
 return false;
 }
 return true;
 }

 async function submit(e) {
 e.preventDefault();
 setMessage("");
 setError("");
 if (!validate()) return;

 const value = Number(amount);
 setBusy(true);
 try {
 const { data } = await api.post("/transactions/pay", { category, provider, accountNumber: accountNumber.trim(), amount: value });
 updateUser({ balance: data.balance });
 setMessage(t("paymentComplete"));
 setAccountNumber("");
 setAmount("");
 } catch (err) {
 setError(err?.response?.data?.message || t("paymentFailed"));
 } finally {
 setBusy(false);
 }
 }

 return (
 <div className="narrow-page">
 <Link to="/" className="back-link"><ArrowLeft size={20} /> {t("backHome")}</Link>
 <div className="simple-card">
 <div className="page-icon"><AccountIcon size={30} /></div>
 <h1>{t("rechargeBills")}</h1>
 <p className="muted">{t("simulatedPayment")}</p>

 <div className="segmented">
 <button type="button" className={category === "recharge" ? "active" : ""} onClick={() => switchCategory("recharge")}>{t("mobileRecharge")}</button>
 <button type="button" className={category === "bill" ? "active" : ""} onClick={() => switchCategory("bill")}>{t("billPayment")}</button>
 </div>

 <form onSubmit={submit} className="form">
 {category === "recharge" ? (
 <>
 <label>{t("mobileOperator")}
 <select value={provider} onChange={(e) => setProvider(e.target.value)}>
 <option value="">{t("chooseOperator")}</option>
 {rechargeOperators.map((item) => <option key={item} value={item}>{item}</option>)}
 </select>
 </label>
 <label>{t("mobileNumber")}
 <input inputMode="numeric" maxLength="10" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))} placeholder="9876543210" />
 </label>
 </>
 ) : (
 <>
 <label>{t("billType")}
 <div className="bill-type-grid">
 {billTypes.map(({ value, labelKey, icon: Icon }) => (
 <button key={value} type="button" className={`bill-type ${provider === value ? "active" : ""}`} onClick={() => setProvider(value)}>
 <Icon size={22} /><span>{t(labelKey)}</span>
 </button>
 ))}
 </div>
 </label>
 <label>{t("consumerNumber")}
 <input inputMode="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder={t("consumerPlaceholder")} />
 </label>
 </>
 )}

 <label>{t("amount")}
 <div className="rupee-input"><span>₹</span><input required inputMode="decimal" type="number" min="1" max="100000" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={category === "recharge" ? "299" : "1000"} /></div>
 </label>

 <div className="quick-amounts">
 <span>{t("quickAmounts")}</span>
 <div>{quickAmounts.map((value) => <button type="button" key={value} onClick={() => setAmount(String(value))}>₹{value}</button>)}</div>
 </div>

 <div className="balance-hint">{t("yourBalance")}: ₹{Number(user?.balance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
 {error && <div className="form-message error" role="alert">{error}</div>}
 {message && <div className="form-message success" role="status"><CheckCircle2 size={20} />{message}</div>}
 <button className="primary-button" disabled={busy}>{busy ? t("processing") : t("payNow")}</button>
 </form>
 </div>
 </div>
 );
}

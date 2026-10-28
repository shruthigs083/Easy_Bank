import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Search, Send, UserRound, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import api from "../services/api.js";

export default function SendMoney() {
 const { user, updateUser } = useAuth(); const { t } = useLanguage(); const navigate = useNavigate();
 const [query, setQuery] = useState(""); const [contacts, setContacts] = useState([]); const [suggestions, setSuggestions] = useState([]);
 const [recipient, setRecipient] = useState(null); const [amount, setAmount] = useState(""); const [step, setStep] = useState(1); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);

 useEffect(() => { api.get("/users/contacts").then(({data}) => setContacts(data.contacts || [])).catch(() => setError(t("errorGeneric"))); }, [t]);
 useEffect(() => {
 const q = query.trim().toLowerCase();
 if (!q) return setSuggestions(contacts.slice(0, 5));
 setSuggestions(contacts.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q)).slice(0, 5));
 }, [query, contacts]);

 async function findRecipient(e) {
 e.preventDefault(); setError(""); setBusy(true);
 try { const { data } = await api.get(`/users/recipient?q=${encodeURIComponent(query)}`); setRecipient(data.users[0]); setStep(2); }
 catch (err) { setError(err.response?.data?.message || t("recipientMissing")); }
 finally { setBusy(false); }
 }
 function choose(contact) { setRecipient({ name: contact.name, phone: contact.phone, email: contact.email || "" }); setQuery(contact.phone); setStep(2); }
 function continueToConfirm(e) { e.preventDefault(); const value = Number(amount); if (!Number.isFinite(value) || value <= 0) return setError(t("validAmount")); if (value > user.balance) return setError(t("notEnough")); setError(""); setStep(3); }
 async function send() { setError(""); setBusy(true); try { const { data } = await api.post("/transactions/send", { recipientPhone: recipient.phone, amount: Number(amount) }); updateUser({ balance: data.balance }); setStep(4); } catch (err) { setError(err.response?.data?.message || t("transferFailed")); } finally { setBusy(false); } }

 return <div className="narrow-page"><Link to="/" className="back-link"><ArrowLeft size={20} /> {t("backHome")}</Link>
 {step === 1 && <div className="simple-card"><div className="page-icon"><Search size={30} /></div><h1>{t("whoSend")}</h1><p className="muted">{t("recipientHelp")}</p>
 <form onSubmit={findRecipient} className="form"><label>{t("recipientNameOrPhone")}<input required value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("recipientPlaceholder")} /></label>
 {suggestions.length > 0 && <div className="suggestions"><p className="suggestion-title"><Star size={15} /> {t("suggestedContacts")}</p>{suggestions.map(c => <button type="button" className="suggestion-row" key={c._id} onClick={() => choose(c)}><UserRound size={19}/><span><strong>{c.name}</strong><small>{c.phone}</small></span></button>)}</div>}
 {error && <div className="form-message error" role="alert">{error}</div>}<button className="primary-button" disabled={busy}>{busy ? t("checking") : t("continue")}</button>
 </form></div>}
 {step === 2 && <div className="simple-card"><div className="page-icon"><UserRound size={30} /></div><h1>{t("howMuch")}</h1><div className="recipient-box"><strong>{recipient.name}</strong><span>{recipient.phone}</span></div><form onSubmit={continueToConfirm} className="form"><label>{t("amount")}<div className="rupee-input"><span>₹</span><input autoFocus inputMode="decimal" type="number" min="1" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="500" /></div></label><p className="balance-hint">{t("yourBalance")}: ₹{Number(user.balance).toLocaleString("en-IN", {minimumFractionDigits:2})}</p> {error && <div className="form-message error" role="alert">{error}</div>}<button className="primary-button">{t("continue")}</button></form></div>}
 {step === 3 && <div className="simple-card"><div className="page-icon"><Send size={30} /></div><h1>{t("checkBefore")}</h1><div className="confirmation-box"><div><span>{t("sendTo")}</span><strong>{recipient.name}</strong></div><div><span>{t("phone")}</span><strong>{recipient.phone}</strong></div><div><span>{t("amount")}</span><strong>₹{Number(amount).toFixed(2)}</strong></div></div>{error && <div className="form-message error" role="alert">{error}</div>}<button className="primary-button" onClick={send} disabled={busy}>{busy ? t("sending") : t("sendMoney")}</button><button className="secondary-button" onClick={() => setStep(2)}>{t("goBack")}</button></div>}
 {step === 4 && <div className="simple-card success-card"><CheckCircle2 size={64} className="success-icon" /><h1>{t("moneySent")}</h1><p>₹{Number(amount).toFixed(2)} {t("sentTo")} {recipient.name}.</p><button className="primary-button" onClick={() => navigate("/")}>{t("done")}</button></div>}
 </div>;
}

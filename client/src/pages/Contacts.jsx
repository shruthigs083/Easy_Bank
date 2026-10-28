import { useEffect, useState } from "react";
import { ArrowLeft, ContactRound, Trash2, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import api from "../services/api.js";

export default function Contacts() {
 const { t } = useLanguage();
 const [contacts, setContacts] = useState([]);
 const [name, setName] = useState("");
 const [phone, setPhone] = useState("");
 const [error, setError] = useState("");
 const [busy, setBusy] = useState(false);

 async function load() {
 try { const { data } = await api.get("/users/contacts"); setContacts(data.contacts || []); } catch { setError(t("errorGeneric")); }
 }
 useEffect(() => { load(); }, []);

 async function add(e) {
 e.preventDefault(); setError(""); setBusy(true);
 try {
 const { data } = await api.post("/users/contacts", { name, phone });
 setContacts((current) => [...current, data.contact]); setName(""); setPhone("");
 } catch (err) { setError(err.response?.data?.message || t("errorGeneric")); }
 finally { setBusy(false); }
 }
 async function remove(id) {
 try { await api.delete(`/users/contacts/${id}`); setContacts((current) => current.filter((c) => c._id !== id)); }
 catch { setError(t("errorGeneric")); }
 }

 return <div className="narrow-page">
 <Link to="/" className="back-link"><ArrowLeft size={20} /> {t("backHome")}</Link>
 <div className="simple-card">
 <div className="page-icon"><ContactRound size={30} /></div>
 <h1>{t("contacts")}</h1>
 <p className="muted">{t("contactsHelp")}</p>
 <form onSubmit={add} className="form">
 <label>{t("contactName")}<input required value={name} onChange={(e) => setName(e.target.value)} placeholder={t("contactNamePlaceholder")} /></label>
 <label>{t("contactPhone")}<input required inputMode="numeric" maxLength="10" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} placeholder="9876543210" /></label>
 {error && <div className="form-message error" role="alert">{error}</div>}
 <button className="primary-button" disabled={busy}><UserPlus size={18} /> {busy ? t("processing") : t("addContact")}</button>
 </form>
 </div>
 <div className="simple-card">
 <h2>{t("savedContacts")}</h2>
 {contacts.length === 0 ? <p className="muted">{t("noContacts")}</p> : <div className="contact-list">
 {contacts.map((contact) => <div className="contact-row" key={contact._id}><div><strong>{contact.name}</strong><span>{contact.phone}</span></div><button className="icon-button" onClick={() => remove(contact._id)} aria-label={t("removeContact")} title={t("removeContact")}><Trash2 size={19} /></button></div>)}
 </div>}
 </div>
 </div>;
}

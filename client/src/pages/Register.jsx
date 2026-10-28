import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import LanguageSwitcher from "../components/LanguageSwitcher.jsx";

export default function Register() {
 const { register } = useAuth();
 const { t } = useLanguage();
 const navigate = useNavigate();
 const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", initialBalance: "" });
 const [show, setShow] = useState(false);
 const [error, setError] = useState("");
 const [busy, setBusy] = useState(false);

 function update(field, value) {
 setForm((current) => ({ ...current, [field]: value }));
 }

 async function submit(e) {
 e.preventDefault();
 setError("");
 const startingBalance = Number(form.initialBalance);
 if (!Number.isFinite(startingBalance) || startingBalance < 0 || startingBalance > 1000000) {
 setError(t("invalidStartingBalance"));
 return;
 }

 setBusy(true);
 try {
 await register({ ...form, initialBalance: startingBalance });
 navigate("/");
 } catch (err) {
 setError(err?.response?.data?.message || t("unableCreate"));
 } finally {
 setBusy(false);
 }
 }

 return (
 <div className="auth-page">
 <div className="auth-language"><LanguageSwitcher /></div>
 <div className="auth-card">
 <div className="auth-logo"><UserPlus size={36} /></div>
 <h1>{t("createEasyAccount")}</h1>
 <p className="subtitle">{t("fewDetails")}</p>

 <form onSubmit={submit} className="form">
 <label>
 {t("fullName")}
 <input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder={t("yourName")} />
 </label>

 <label>
 {t("email")}
 <input required type="email" autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
 </label>

 <label>
 {t("phone")}
 <input required inputMode="numeric" autoComplete="tel-national" maxLength="10"
 value={form.phone} onChange={(e) => update("phone", e.target.value.replace(/\D/g, ""))}
 placeholder={t("phonePlaceholder")} />
 </label>

 <label>
 {t("password")}
 <span className="password-wrap">
 <input required minLength="6" type={show ? "text" : "password"} autoComplete="new-password"
 value={form.password} onChange={(e) => update("password", e.target.value)} placeholder={t("atLeast6")} />
 <button type="button" className="password-toggle" onClick={() => setShow(!show)}
 aria-label={show ? t("hidePassword") : t("showPassword")}>
 {show ? <EyeOff size={22} /> : <Eye size={22} />}
 </button>
 </span>
 </label>

 <label>
 {t("startingBalance")}
 <div className="rupee-input">
 <span>₹</span>
 <input required inputMode="decimal" type="number" min="0" max="1000000" step="0.01"
 value={form.initialBalance} onChange={(e) => update("initialBalance", e.target.value)} placeholder="0" />
 </div>
 <small className="field-help">{t("startingBalanceHelp")}</small>
 </label>

 {error && <div className="form-message error" role="alert">{error}</div>}

 <button className="primary-button" disabled={busy}>
 {busy ? t("creating") : t("createAccount")}
 </button>
 </form>

 <p className="auth-footer">
 {t("alreadyHave")} <Link to="/login">{t("login")}</Link>
 </p>
 </div>
 </div>
 );
}

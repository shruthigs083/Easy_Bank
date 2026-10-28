import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Landmark, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import LanguageSwitcher from "../components/LanguageSwitcher.jsx";

export default function Login() {
 const { login } = useAuth();
 const { t } = useLanguage();
 const navigate = useNavigate();
 const [form, setForm] = useState({ email: "", password: "" });
 const [show, setShow] = useState(false);
 const [error, setError] = useState("");
 const [busy, setBusy] = useState(false);

 async function submit(e) {
 e.preventDefault();
 setError("");
 setBusy(true);
 try {
 await login(form.email, form.password);
 navigate("/");
 } catch (err) {
 setError(err?.response?.data?.message || t("unableLogin"));
 } finally {
 setBusy(false);
 }
 }

 return (
 <div className="auth-page">
 <div className="auth-language"><LanguageSwitcher /></div>
 <div className="auth-card">
 <div className="auth-logo"><Landmark size={36} /></div>
 <h1>{t("welcomeTo")}</h1>
 <p className="subtitle">{t("simpleForEveryone")}</p>

 <form onSubmit={submit} className="form">
 <label>
 {t("email")}
 <input type="email" required autoComplete="email" value={form.email}
 onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
 </label>

 <label>
 {t("password")}
 <span className="password-wrap">
 <input type={show ? "text" : "password"} required autoComplete="current-password"
 value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
 placeholder={t("enterPassword")} />
 <button type="button" className="password-toggle" onClick={() => setShow(!show)}
 aria-label={show ? t("hidePassword") : t("showPassword")}>
 {show ? <EyeOff size={22} /> : <Eye size={22} />}
 </button>
 </span>
 </label>

 {error && <div className="form-message error" role="alert">{error}</div>}

 <button className="primary-button" disabled={busy}>
 {busy ? t("loggingIn") : t("login")} <ArrowRight size={21} />
 </button>
 </form>

 <p className="auth-footer">
 {t("newTo")} <Link to="/register">{t("createAccount")}</Link>
 </p>
 <p className="-note">{t("demoStart")}</p>
 </div>
 </div>
 );
}

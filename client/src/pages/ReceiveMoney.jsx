import { Copy, ArrowLeft, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function ReceiveMoney() {
 const { user } = useAuth();
 const { t } = useLanguage();
 const [copied, setCopied] = useState(false);
 const [error, setError] = useState("");

 async function copyPhone() {
 setError("");
 try {
 await navigator.clipboard.writeText(user.phone || "");
 setCopied(true);
 setTimeout(() => setCopied(false), 1800);
 } catch {
 setError(t("copyFailed"));
 }
 }

 return (
 <div className="narrow-page">
 <Link to="/" className="back-link"><ArrowLeft size={20} /> {t("backHome")}</Link>
 <div className="simple-card">
 <div className="page-icon">₹</div>
 <h1>{t("receiveTitle")}</h1>
 <p className="muted">{t("receiveHelp")}</p>
 <div className="account-detail"><span>{t("name")}</span><strong>{user.name}</strong></div>
 <div className="account-detail"><span>{t("yourEmail")}</span><strong>{user.email}</strong></div>
 <div className="account-detail"><span>{t("yourPhone")}</span><strong>{user.phone || t("notAdded")}</strong></div>
 {error && <div className="form-message error" role="alert">{error}</div>}
 <button className="secondary-button" onClick={copyPhone} disabled={!user.phone}>
 {copied ? <Check size={21} /> : <Copy size={21} />} {copied ? t("copied") : t("copyPhone")}
 </button>
 <div className="info-box"><strong>{t("demoNote")}</strong><p>{t("receiveNote")}</p></div>
 </div>
 </div>
 );
}

import { ArrowLeft, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function Profile() {
 const { user } = useAuth();
 const { t } = useLanguage();

 return (
 <div className="narrow-page">
 <Link to="/" className="back-link"><ArrowLeft size={20} /> {t("backHome")}</Link>
 <div className="simple-card">
 <div className="profile-avatar"><UserCircle size={72} /></div>
 <h1>{user.name}</h1>
 <p className="muted">{t("profileTitle")}</p>
 <div className="profile-details">
 <div><span>{t("name")}</span><strong>{user.name}</strong></div>
 <div><span>{t("email")}</span><strong>{user.email}</strong></div>
 <div><span>{t("phone")}</span><strong>{user.phone || t("notAdded")}</strong></div>
 <div><span>{t("demoBalance")}</span><strong>₹{Number(user.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></div>
 </div>
 <div className="info-box"><strong>{t("accessibilityTip")}</strong><p>{t("languageTip")}</p></div>
 </div>
 </div>
 );
}
